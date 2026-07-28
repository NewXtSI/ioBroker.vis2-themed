import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import type VisRxWidget from '@iobroker/types-vis-2/visRxWidget';
import './ThemedDropdown.css';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownRxData {
  oid: string;
  placeholder: string;
  optionsText: string;
  useAccent: boolean;
  disabled: boolean;
}

interface DropdownState extends VisRxWidgetState {
  isFocused: boolean;
  objectOptions: DropdownOption[];
}

interface ObjectWithStates {
  common?: {
    states?: Record<string, string> | string[];
  };
}

export default class ThemedDropdown extends (window.visRxWidget as typeof VisRxWidget)<DropdownRxData, DropdownState> {
  static adapter: string;
  private optionsLoadRetry = 0;
  private optionsLoadTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: VisRxWidgetProps) {
    super(props);
    this.state = {
      ...this.state,
      isFocused: false,
      objectOptions: []
    };
  }

  static getWidgetInfo(): RxWidgetInfo {
    return {
      id: 'tplThemedDropdown',
      visSet: 'vis2-themed',
      visSetIcon: 'widgets/vis2-themed/img/vis2-themed.svg',
      visName: 'themed_dropdown',
      visAttrs: [
        {
          name: 'common',
          fields: [
            {
              name: 'oid',
              label: 'themed_dropdown_oid',
              type: 'id'
            },
            {
              name: 'placeholder',
              label: 'themed_dropdown_placeholder',
              type: 'text',
              default: 'Bitte waehlen'
            },
            {
              name: 'optionsText',
              label: 'themed_dropdown_options',
              type: 'text',
              default: ''
            },
            {
              name: 'optionsHint',
              type: 'help',
              text: 'themed_dropdown_options_hint'
            },
            {
              name: 'useAccent',
              label: 'themed_dropdown_use_accent',
              type: 'checkbox',
              default: true
            },
            {
              name: 'disabled',
              label: 'themed_dropdown_disabled',
              type: 'checkbox',
              default: false
            }
          ]
        }
      ],
      visPrev: 'widgets/vis2-themed/img/themed_dropdown_prev.svg'
    };
  }

  getWidgetInfo(): RxWidgetInfo {
    return ThemedDropdown.getWidgetInfo();
  }

  static getI18nPrefix(): string {
    return `${ThemedDropdown.adapter}_`;
  }

  componentDidMount(): void {
    super.componentDidMount();
    this.optionsLoadRetry = 0;
    void this.updateObjectOptions();
  }

  onRxDataChanged(prevRxData: DropdownRxData): void {
    if (prevRxData.oid !== this.state.rxData.oid) {
      this.optionsLoadRetry = 0;
      if (this.optionsLoadTimer) {
        clearTimeout(this.optionsLoadTimer);
        this.optionsLoadTimer = null;
      }
      void this.updateObjectOptions();
    }
  }

  componentWillUnmount(): void {
    if (this.optionsLoadTimer) {
      clearTimeout(this.optionsLoadTimer);
      this.optionsLoadTimer = null;
    }
    super.componentWillUnmount();
  }

  private scheduleOptionsReload(stateId: string): void {
    if (this.optionsLoadRetry >= 8 || this.optionsLoadTimer) {
      return;
    }
    this.optionsLoadRetry += 1;
    this.optionsLoadTimer = setTimeout(() => {
      this.optionsLoadTimer = null;
      if ((this.state.rxData.oid || '').trim() === stateId) {
        void this.updateObjectOptions();
      }
    }, 800);
  }

  private async updateObjectOptions(): Promise<void> {
    const stateId = (this.state.rxData.oid || '').trim();
    if (!stateId) {
      this.setState({ objectOptions: [] });
      return;
    }

    try {
      const targetObject = await this.resolveTargetObject(stateId);
      const states = targetObject?.common?.states;

      if (!states || typeof states !== 'object') {
        this.setState({ objectOptions: [] });
        this.scheduleOptionsReload(stateId);
        return;
      }

      const objectOptions = Array.isArray(states)
        ? states
            .map(entry => `${entry}`.trim())
            .filter(Boolean)
            .map(entry => ({ label: entry, value: entry }))
        : Object.entries(states)
            .map(([value, label]) => ({
              value: `${value}`,
              label: `${label ?? value}`.trim() || `${value}`
            }))
            .filter(option => option.value);

      this.optionsLoadRetry = 0;
      this.setState({ objectOptions });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (typeof this.props.context.logError === 'function') {
        this.props.context.logError(`ThemedDropdown: cannot resolve common.states for "${stateId}": ${message}`);
      }
      this.setState({ objectOptions: [] });
      this.scheduleOptionsReload(stateId);
    }
  }

  private async resolveTargetObject(stateId: string): Promise<ObjectWithStates | undefined> {
    const ctx = this.props.context as unknown as {
      getObjects?: (useCache?: boolean) => Promise<Record<string, ioBroker.Object>>;
      _socket?: {
        emit?: (cmd: string, data: any, cb: (result: any) => void) => void;
      };
    };

    const visGlobal = (window as unknown as {
      vis?: {
        objects?: Record<string, ioBroker.Object>;
      };
    }).vis;

    const objectFromVis = visGlobal?.objects?.[stateId];
    if (objectFromVis) {
      return objectFromVis;
    }

    if (typeof ctx.getObjects === 'function') {
      const uncachedObjects = await ctx.getObjects(false);
      const fromUncached = uncachedObjects?.[stateId];
      if (fromUncached) {
        return fromUncached;
      }

      const cachedObjects = await ctx.getObjects(true);
      const fromCached = cachedObjects?.[stateId];
      if (fromCached) {
        return fromCached;
      }
    }

    return undefined;
  }

  private parseOptions(): DropdownOption[] {
    return (this.state.rxData.optionsText || '')
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const separatorIndex = line.indexOf('|');
        if (separatorIndex === -1) {
          return {
            label: line,
            value: line
          };
        }

        const label = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim();
        return {
          label: label || value,
          value: value || label
        };
      })
      .filter(option => option.label && option.value);
  }

  private convertValue(rawValue: string): string | number | boolean | null {
    const stateId = this.state.rxData.oid;
    const currentValue = stateId ? this.state.values[`${stateId}.val`] : undefined;

    if (typeof currentValue === 'boolean') {
      return rawValue === 'true';
    }

    if (typeof currentValue === 'number') {
      const numericValue = Number(rawValue);
      return Number.isFinite(numericValue) ? numericValue : currentValue;
    }

    if (rawValue === 'true') {
      return true;
    }

    if (rawValue === 'false') {
      return false;
    }

    if (rawValue === 'null') {
      return null;
    }

    const numericValue = Number(rawValue);
    if (rawValue !== '' && Number.isFinite(numericValue) && `${numericValue}` === rawValue) {
      return numericValue;
    }

    return rawValue;
  }

  private onValueChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    if (this.state.rxData.disabled || !this.state.rxData.oid) {
      return;
    }

    this.props.context.setValue(this.state.rxData.oid, this.convertValue(event.target.value));
  };

  renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
    super.renderWidgetBody(props);

    const options = this.state.objectOptions.length ? this.state.objectOptions : this.parseOptions();
    const stateId = this.state.rxData.oid;
    const currentValue = stateId ? this.state.values[`${stateId}.val`] : undefined;
    const currentValueText = currentValue === undefined || currentValue === null ? '' : String(currentValue);
    const hasMatchingValue = options.some(option => option.value === currentValueText);
    const displayOptions = !hasMatchingValue && currentValueText
      ? [{ label: currentValueText, value: currentValueText }, ...options]
      : options;
    const selectedValue = currentValueText && displayOptions.some(option => option.value === currentValueText) ? currentValueText : '';
    const placeholder = (this.state.rxData.placeholder || '').trim() || ThemedDropdown.t('themed_dropdown_default_placeholder');
    const disabled = this.state.rxData.disabled === true || displayOptions.length === 0;
    const useAccent = this.state.rxData.useAccent !== false;

    return (
      <div className="themed-dropdown-root">
        <div className={`neu-dropdown ${useAccent ? 'with-accent' : 'no-accent'} ${disabled ? 'disabled' : ''} ${this.state.isFocused ? 'focused' : ''}`}>
          <div className="dropdown-shell">
            <select
              className="dropdown-select"
              value={selectedValue}
              onChange={this.onValueChange}
              onFocus={() => this.setState({ isFocused: true })}
              onBlur={() => this.setState({ isFocused: false })}
              disabled={disabled}
            >
              <option value="" disabled>
                {displayOptions.length ? placeholder : ThemedDropdown.t('themed_dropdown_no_options')}
              </option>
              {displayOptions.map(option => (
                <option key={`${option.label}:${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="dropdown-chevron" aria-hidden="true">
              <span />
              <span />
            </span>
          </div>
        </div>
      </div>
    );
  }
}