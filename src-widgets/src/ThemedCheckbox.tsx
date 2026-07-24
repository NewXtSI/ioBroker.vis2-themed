import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import type VisRxWidget from '@iobroker/types-vis-2/visRxWidget';

interface CheckboxRxData {
  oid: string;
  text: string;
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
              name: 'text',
              label: 'themed_checkbox_label',
              type: 'text',
              default: 'Checkbox'
            }
          ]
        },
        {
          name: 'data',
          fields: [
            {
              name: 'oid',
              label: 'themed_checkbox_oid',
              type: 'id'
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
    this.props.context.setValue(`${targetId}.val`, event.target.checked);
  };

  renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
    super.renderWidgetBody(props);

    const stateId = this.state.rxData.oid;
    const value = stateId ? this.state.values[`${stateId}.val`] : false;
    const checked = Boolean(value);
    const label = this.state.rxData.text || ThemedCheckbox.t('themed_checkbox_default_text');

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 8
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={this.onToggle}
          style={{ width: 18, height: 18, accentColor: '#1a7f64' }}
        />
        <span>{label}</span>
      </div>
    );
  }
}
