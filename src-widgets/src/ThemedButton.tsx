import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import type VisRxWidget from '@iobroker/types-vis-2/visRxWidget';
import './ThemedButton.css';

interface ButtonRxData {
  oid: string;
  text: string;
  useAccent: boolean;
  pushButton: boolean;
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
              type: 'id'
            },
            {
              name: 'text',
              label: 'themed_button_label',
              type: 'text',
              default: 'System aktiv'
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
    this.writeValue(event.target.checked);
  };

  private onPressStart = (): void => {
    if (!this.state.rxData.pushButton) {
      return;
    }
    this.setState({ pushActive: true });
    this.writeValue(true);
  };

  private onPressEnd = (): void => {
    if (!this.state.rxData.pushButton) {
      return;
    }
    this.setState({ pushActive: false });
    this.writeValue(false);
  };

  renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
    super.renderWidgetBody(props);

    const stateId = this.state.rxData.oid;
    const value = stateId ? this.state.values[`${stateId}.val`] : false;
    const pushButton = this.state.rxData.pushButton === true;
    const checked = pushButton ? this.state.pushActive : Boolean(value);
    const useAccent = this.state.rxData.useAccent !== false;
    const text = this.state.rxData.text || ThemedButton.t('themed_button_default_text');

    return (
      <div className="themed-button-root">
        <label
          className={`neu-button ${useAccent ? 'with-accent' : 'no-accent'}`}
          onPointerDown={this.onPressStart}
          onPointerUp={this.onPressEnd}
          onPointerCancel={this.onPressEnd}
          onPointerLeave={this.onPressEnd}
        >
          <input type="checkbox" checked={checked} onChange={this.onToggle} />
          <span className="btn-content">{text}</span>
        </label>
      </div>
    );
  }
}
