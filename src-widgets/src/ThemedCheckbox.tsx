import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import type VisRxWidget from '@iobroker/types-vis-2/visRxWidget';
import './ThemedCheckbox.css';

interface CheckboxRxData {
  oid: string;
  text: string;
  useAccent: boolean;
}

export default class ThemedCheckbox extends (window.visRxWidget as typeof VisRxWidget)<CheckboxRxData, VisRxWidgetState> {
  static adapter: string;

  constructor(props: VisRxWidgetProps) {
    super(props);
  }

  static getWidgetInfo(): RxWidgetInfo {
    return {
      id: 'tplThemedCheckbox',
      visSet: 'vis2-themed',
      visSetIcon: 'widgets/vis2-themed/img/vis2-themed.svg',
      visSetLabel: 'vis2_themed_set_label',
      visSetColor: '#1a7f64',
      visName: 'themed_checkbox',
      visAttrs: [
        {
          name: 'common',
          fields: [
            {
              name: 'oid',
              label: 'themed_checkbox_oid',
              type: 'id'
            },
            {
              name: 'text',
              label: 'themed_checkbox_label',
              type: 'text',
              default: 'Checkbox'
            },
            {
              name: 'useAccent',
              label: 'themed_checkbox_use_accent',
              type: 'checkbox',
              default: true
            }
          ]
        }
      ],
      visPrev: 'widgets/vis2-themed/img/themed_checkbox_prev.svg'
    };
  }

  getWidgetInfo(): RxWidgetInfo {
    return ThemedCheckbox.getWidgetInfo();
  }

  static getI18nPrefix(): string {
    return `${ThemedCheckbox.adapter}_`;
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
    const useAccent = this.state.rxData.useAccent !== false;

    return (
      <div className="themed-checkbox-root">
        <label className={`neu-switch ${useAccent ? 'with-accent' : 'no-accent'}`}>
          <input type="checkbox" checked={checked} onChange={this.onToggle} />
          <span className="slider" />
        </label>
      </div>
    );
  }
}
