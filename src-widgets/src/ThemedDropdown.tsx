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
  text: string;
  placeholder: string;
  optionsText: string;
  useAccent: boolean;
  disabled: boolean;
}

interface DropdownState extends VisRxWidgetState {
  isFocused: boolean;
}

export default class ThemedDropdown extends (window.visRxWidget as typeof VisRxWidget)<DropdownRxData, DropdownState> {
  static adapter: string;

  constructor(props: VisRxWidgetProps) {
    super(props);
    this.state = {
      ...this.state,
      isFocused: false
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
              name: 'text',
              label: 'themed_dropdown_label',
              type: 'text',
              default: 'Ausrichtung'
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
              default: 'Links|left\nZentriert|center\nRechts|right'
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

    const options = this.parseOptions();
    const stateId = this.state.rxData.oid;
    const currentValue = stateId ? this.state.values[`${stateId}.val`] : undefined;
    const currentValueText = currentValue === undefined || currentValue === null ? '' : String(currentValue);
    const hasMatchingValue = options.some(option => option.value === currentValueText);
    const placeholder = (this.state.rxData.placeholder || '').trim() || ThemedDropdown.t('themed_dropdown_default_placeholder');
    const label = (this.state.rxData.text || '').trim();
    const disabled = this.state.rxData.disabled === true || options.length === 0;
    const useAccent = this.state.rxData.useAccent !== false;

    return (
      <div className="themed-dropdown-root">
        <div className={`neu-dropdown ${useAccent ? 'with-accent' : 'no-accent'} ${disabled ? 'disabled' : ''} ${this.state.isFocused ? 'focused' : ''}`}>
          {label ? <div className="dropdown-label">{label}</div> : null}
          <div className="dropdown-shell">
            <select
              className="dropdown-select"
              value={hasMatchingValue ? currentValueText : ''}
              onChange={this.onValueChange}
              onFocus={() => this.setState({ isFocused: true })}
              onBlur={() => this.setState({ isFocused: false })}
              disabled={disabled}
            >
              <option value="" disabled>
                {options.length ? placeholder : ThemedDropdown.t('themed_dropdown_no_options')}
              </option>
              {options.map(option => (
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