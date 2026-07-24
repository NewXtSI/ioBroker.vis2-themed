import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import type VisRxWidget from '@iobroker/types-vis-2/visRxWidget';
import './ThemedButton.css';

interface ButtonRxData {
  oid: string;
  text: string;
}

export default class ThemedButton extends (window.visRxWidget as typeof VisRxWidget)<ButtonRxData, VisRxWidgetState> {
  static adapter: string;

  constructor(props: VisRxWidgetProps) {
    super(props);
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

  private onToggle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const targetId = this.state.rxData.oid;
    if (!targetId) {
      return;
    }
    this.props.context.setValue(targetId, event.target.checked);
  };

  renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
    super.renderWidgetBody(props);

    const stateId = this.state.rxData.oid;
    const value = stateId ? this.state.values[`${stateId}.val`] : false;
    const checked = Boolean(value);
    const text = this.state.rxData.text || ThemedButton.t('themed_button_default_text');

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}
      >
        <label className="neu-button">
          <input type="checkbox" checked={checked} onChange={this.onToggle} />
          <span className="btn-content">
            <svg className="icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            {text}
          </span>
        </label>
      </div>
    );
  }
}
