import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import type VisRxWidget from '@iobroker/types-vis-2/visRxWidget';
import './ThemedButton.css';

interface ButtonRxData {
  oid: string;
  text: string;
  useAccent: boolean;
  pushButton: boolean;
  pushToggle: boolean;
  circle: boolean;
  navigateMode: boolean;
  navigationView: string;
}

interface ButtonState extends VisRxWidgetState {
  pushActive: boolean;
}

export default class ThemedButton extends (window.visRxWidget as typeof VisRxWidget)<ButtonRxData, ButtonState> {
  static adapter: string;

  constructor(props: VisRxWidgetProps) {
    super(props);
    this.state = {
      ...this.state,
      pushActive: false
    };
  }

  static getWidgetInfo(): RxWidgetInfo {
    return {
      id: 'tplThemedButton',
      visSet: 'vis2-themed',
      visSetIcon: 'widgets/vis2-themed/img/vis2-themed.svg',
      visName: 'themed_button',
      visAttrs: [
        {
          name: 'common',
          fields: [
            {
              name: 'oid',
              label: 'themed_button_oid',
              type: 'id',
              hidden: 'return data.navigateMode;'
            },
            {
              name: 'text',
              label: 'themed_button_label',
              type: 'text',
              default: 'System aktiv'
            },
            {
              name: 'navigateMode',
              label: 'themed_button_nav_mode',
              type: 'checkbox',
              default: false
            },
            {
              name: 'navigationSectionHint',
              type: 'help',
              text: 'themed_button_nav_section',
              hidden: 'return !data.navigateMode;'
            },
            {
              name: 'navigationView',
              label: 'themed_button_nav_view',
              type: 'views',
              default: '',
              hidden: 'return !data.navigateMode;'
            },
            {
              name: 'useAccent',
              label: 'themed_button_use_accent',
              type: 'checkbox',
              default: true
            },
            {
              name: 'pushButton',
              label: 'themed_button_push_mode',
              type: 'checkbox',
              default: false
            },
            {
              name: 'pushToggle',
              label: 'themed_button_push_toggle',
              type: 'checkbox',
              default: false,
              hidden: 'return !data.pushButton || data.navigateMode;'
            },
            {
              name: 'circle',
              label: 'themed_button_circle',
              type: 'checkbox',
              default: false
            }
          ]
        }
      ],
      visPrev: 'widgets/vis2-themed/img/themed_button_prev.svg'
    };
  }

  getWidgetInfo(): RxWidgetInfo {
    return ThemedButton.getWidgetInfo();
  }

  static getI18nPrefix(): string {
    return `${ThemedButton.adapter}_`;
  }

  private writeValue = (value: boolean): void => {
    const targetId = this.state.rxData.oid;
    if (!targetId) {
      return;
    }
    this.props.context.setValue(targetId, value);
  };

  private onToggle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (this.state.rxData.pushButton) {
      return;
    }

    if (this.state.rxData.navigateMode) {
      this.navigateToView();
      return;
    }

    this.writeValue(event.target.checked);
  };

  private navigateToView = (): void => {
    const targetView = (this.state.rxData.navigationView || '').trim();
    if (!targetView) {
      return;
    }

    const ctx = this.props.context as unknown as {
      changeView?: (view: string) => void;
      setView?: (view: string) => void;
      onChangePage?: (view: string) => void;
      setCurrentView?: (view: string) => void;
    };

    if (typeof ctx.changeView === 'function') {
      ctx.changeView(targetView);
      return;
    }

    if (typeof ctx.setView === 'function') {
      ctx.setView(targetView);
      return;
    }

    if (typeof ctx.onChangePage === 'function') {
      ctx.onChangePage(targetView);
      return;
    }

    if (typeof ctx.setCurrentView === 'function') {
      ctx.setCurrentView(targetView);
      return;
    }

    const visGlobal = (window as unknown as {
      vis?: {
        changeView?: (view: string) => void;
        setView?: (view: string) => void;
      };
    }).vis;

    if (visGlobal && typeof visGlobal.changeView === 'function') {
      visGlobal.changeView(targetView);
      return;
    }

    if (visGlobal && typeof visGlobal.setView === 'function') {
      visGlobal.setView(targetView);
    }
  };

  private onPressStart = (event: React.PointerEvent<HTMLLabelElement>): void => {
    if (!this.state.rxData.pushButton || this.state.pushActive) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    this.setState({ pushActive: true });

    if (this.state.rxData.navigateMode) {
      this.navigateToView();
      return;
    }

    if (this.state.rxData.pushToggle) {
      const current = Boolean(this.state.values[`${this.state.rxData.oid}.val`]);
      this.writeValue(!current);
      return;
    }

    this.writeValue(true);
  };

  private onPressEnd = (): void => {
    if (!this.state.rxData.pushButton) {
      return;
    }

    if (!this.state.pushActive) {
      return;
    }

    this.setState({ pushActive: false });

    if (this.state.rxData.pushToggle) {
      return;
    }
  };

  renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
    super.renderWidgetBody(props);

    const stateId = this.state.rxData.oid;
    const value = stateId ? this.state.values[`${stateId}.val`] : false;
    const pushButton = this.state.rxData.pushButton === true;
    const pushToggle = this.state.rxData.pushToggle === true;
    const navigateMode = this.state.rxData.navigateMode === true;
    const checked = navigateMode
      ? pushButton
        ? this.state.pushActive
        : false
      : pushButton
        ? pushToggle
          ? Boolean(value)
          : this.state.pushActive
        : Boolean(value);
    const useAccent = this.state.rxData.useAccent !== false;
    const circle = this.state.rxData.circle === true;
    const text = this.state.rxData.text || ThemedButton.t('themed_button_default_text');

    return (
      <div className="themed-button-root">
        <label
          className={`neu-button ${useAccent ? 'with-accent' : 'no-accent'} ${circle ? 'circle' : 'rect'}`}
          onPointerDown={this.onPressStart}
          onPointerUp={this.onPressEnd}
          onPointerCancel={this.onPressEnd}
          onPointerLeave={this.onPressEnd}
          onBlur={this.onPressEnd}
        >
          <input type="checkbox" checked={checked} onChange={this.onToggle} readOnly={pushButton} />
          <span className="btn-content">{text}</span>
        </label>
      </div>
    );
  }
}
