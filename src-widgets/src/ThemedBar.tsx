import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import type VisRxWidget from '@iobroker/types-vis-2/visRxWidget';
import './ThemedBar.css';

interface BarRxData {
  oid: string;
  min: number;
  max: number;
  color: string;
  useAccent: boolean;
  vertical: boolean;
}

export default class ThemedBar extends (window.visRxWidget as typeof VisRxWidget)<BarRxData, VisRxWidgetState> {
  static adapter: string;

  constructor(props: VisRxWidgetProps) {
    super(props);
  }

  static getWidgetInfo(): RxWidgetInfo {
    return {
      id: 'tplThemedBar',
      visSet: 'vis2-themed',
      visSetIcon: 'widgets/vis2-themed/img/vis2-themed.svg',
      visName: 'themed_bar',
      visAttrs: [
        {
          name: 'common',
          fields: [
            {
              name: 'oid',
              label: 'themed_bar_oid',
              type: 'id'
            },
            {
              name: 'min',
              label: 'themed_bar_min',
              type: 'number',
              default: 0
            },
            {
              name: 'max',
              label: 'themed_bar_max',
              type: 'number',
              default: 100
            },
            {
              name: 'useAccent',
              label: 'themed_bar_use_accent',
              type: 'checkbox',
              default: true
            },
            {
              name: 'color',
              label: 'themed_bar_color',
              type: 'color',
              default: ''
            },
            {
              name: 'vertical',
              label: 'themed_bar_vertical',
              type: 'checkbox',
              default: false
            }
          ]
        }
      ],
      visPrev: 'widgets/vis2-themed/img/themed_bar_prev.svg'
    };
  }

  getWidgetInfo(): RxWidgetInfo {
    return ThemedBar.getWidgetInfo();
  }

  static getI18nPrefix(): string {
    return `${ThemedBar.adapter}_`;
  }

  renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
    super.renderWidgetBody(props);

    const stateId = this.state.rxData.oid;
    const raw = stateId ? this.state.values[`${stateId}.val`] : 0;
    const value = Number(raw);
    const min = Number.isFinite(this.state.rxData.min) ? this.state.rxData.min : 0;
    const max = Number.isFinite(this.state.rxData.max) ? this.state.rxData.max : 100;
    const range = max - min <= 0 ? 1 : max - min;
    const progress = Math.max(0, Math.min(1, (value - min) / range));
    const size = `${progress * 100}%`;
    const useAccent = this.state.rxData.useAccent !== false;
    const vertical = this.state.rxData.vertical === true;
    const customColor = (this.state.rxData.color || '').trim();
    const fillStyle: React.CSSProperties = vertical ? { height: size } : { width: size };

    if (customColor) {
      (fillStyle as React.CSSProperties & { '--fill-color': string })['--fill-color'] = customColor;
    }

    return (
      <div className="themed-bar-root">
        <div className={`neu-bar ${useAccent ? 'with-accent' : 'no-accent'} ${vertical ? 'vertical' : 'horizontal'}`}>
          <div className={`neu-bar-fill ${customColor ? 'custom-color' : ''}`} style={fillStyle} />
        </div>
      </div>
    );
  }
}
