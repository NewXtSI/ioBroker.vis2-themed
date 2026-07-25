import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import type VisRxWidget from '@iobroker/types-vis-2/visRxWidget';
import './ThemedSlider.css';

interface SliderRxData {
  oid: string;
  min: number;
  max: number;
  steps: number;
  writeDelay: number;
  color: string;
  useAccent: boolean;
  vertical: boolean;
}

interface SliderState extends VisRxWidgetState {
  dragValue?: number;
}

export default class ThemedSlider extends (window.visRxWidget as typeof VisRxWidget)<SliderRxData, SliderState> {
  static adapter: string;

  private writeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: VisRxWidgetProps) {
    super(props);
    this.state = {
      ...this.state,
      dragValue: undefined
    };
  }

  static getWidgetInfo(): RxWidgetInfo {
    return {
      id: 'tplThemedSlider',
      visSet: 'vis2-themed',
      visSetIcon: 'widgets/vis2-themed/img/vis2-themed.svg',
      visName: 'themed_slider',
      visAttrs: [
        {
          name: 'common',
          fields: [
            {
              name: 'oid',
              label: 'themed_slider_oid',
              type: 'id'
            },
            {
              name: 'min',
              label: 'themed_slider_min',
              type: 'number',
              default: 0
            },
            {
              name: 'max',
              label: 'themed_slider_max',
              type: 'number',
              default: 100
            },
            {
              name: 'steps',
              label: 'themed_slider_steps',
              type: 'number',
              default: 1,
              min: 0
            },
            {
              name: 'writeDelay',
              label: 'themed_slider_write_delay',
              type: 'number',
              default: 500,
              min: 0
            },
            {
              name: 'useAccent',
              label: 'themed_slider_use_accent',
              type: 'checkbox',
              default: true
            },
            {
              name: 'vertical',
              label: 'themed_slider_vertical',
              type: 'checkbox',
              default: false
            },
            {
              name: 'color',
              label: 'themed_slider_color',
              type: 'color',
              default: ''
            }
          ]
        }
      ],
      visPrev: 'widgets/vis2-themed/img/themed_slider_prev.svg'
    };
  }

  getWidgetInfo(): RxWidgetInfo {
    return ThemedSlider.getWidgetInfo();
  }

  static getI18nPrefix(): string {
    return `${ThemedSlider.adapter}_`;
  }

  componentWillUnmount(): void {
    if (this.writeTimer) {
      clearTimeout(this.writeTimer);
      this.writeTimer = null;
    }
    super.componentWillUnmount();
  }

  private getRange(): { min: number; max: number; range: number } {
    const min = Number.isFinite(this.state.rxData.min) ? this.state.rxData.min : 0;
    const max = Number.isFinite(this.state.rxData.max) ? this.state.rxData.max : 100;
    const range = max - min <= 0 ? 1 : max - min;
    return { min, max, range };
  }

  private clampAndStep(value: number): number {
    const { min, max } = this.getRange();
    const safe = Math.max(min, Math.min(max, value));
    const steps = Number(this.state.rxData.steps) || 0;
    if (steps <= 0) {
      return safe;
    }
    const snapped = Math.round((safe - min) / steps) * steps + min;
    return Math.max(min, Math.min(max, snapped));
  }

  private scheduleWrite(value: number): void {
    const targetId = this.state.rxData.oid;
    if (!targetId) {
      return;
    }
    if (this.writeTimer) {
      clearTimeout(this.writeTimer);
    }
    const delay = Math.max(0, Number(this.state.rxData.writeDelay) || 0);
    this.writeTimer = setTimeout(() => {
      this.writeTimer = null;
      this.props.context.setValue(targetId, value);
    }, delay);
  }

  private onSliderChange = (_event: Event, nextValue: number | number[]): void => {
    const raw = Array.isArray(nextValue) ? nextValue[0] : nextValue;
    const value = this.clampAndStep(raw);
    this.setState({ dragValue: value });
    this.scheduleWrite(value);
  };

  private onSliderCommitted = (_event: Event | React.SyntheticEvent, nextValue: number | number[]): void => {
    const raw = Array.isArray(nextValue) ? nextValue[0] : nextValue;
    const value = this.clampAndStep(raw);
    if (this.writeTimer) {
      clearTimeout(this.writeTimer);
      this.writeTimer = null;
    }
    if (this.state.rxData.oid) {
      this.props.context.setValue(this.state.rxData.oid, value);
    }
    this.setState({ dragValue: undefined });
  };

  renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
    super.renderWidgetBody(props);

    const { min, range } = this.getRange();
    const raw = this.state.rxData.oid ? Number(this.state.values[`${this.state.rxData.oid}.val`]) : min;
    const currentValue = this.state.dragValue ?? this.clampAndStep(Number.isFinite(raw) ? raw : min);
    const progress = Math.max(0, Math.min(1, (currentValue - min) / range));
    const percent = `${progress * 100}%`;
    const useAccent = this.state.rxData.useAccent !== false;
    const vertical = this.state.rxData.vertical === true;
    const customColor = (this.state.rxData.color || '').trim();
    const fillStyle: React.CSSProperties = vertical ? { height: percent } : { width: percent };
    if (customColor) {
      (fillStyle as React.CSSProperties & { '--fill-color': string })['--fill-color'] = customColor;
    }

    return (
      <div className="themed-slider-root">
        <div className={`neu-slider ${useAccent ? 'with-accent' : 'no-accent'} ${vertical ? 'vertical' : 'horizontal'}`}>
          <div className={`neu-slider-fill ${customColor ? 'custom-color' : ''}`} style={fillStyle} />
          <input
            className="neu-slider-input"
            type="range"
            min={this.state.rxData.min ?? 0}
            max={this.state.rxData.max ?? 100}
            step="any"
            value={currentValue}
            onChange={event => this.onSliderChange(event.nativeEvent, Number(event.target.value))}
            onMouseUp={event => this.onSliderCommitted(event, Number((event.target as HTMLInputElement).value))}
            onTouchEnd={event => this.onSliderCommitted(event, currentValue)}
            orient={vertical ? 'vertical' : undefined}
          />
          <div className="neu-slider-thumb" style={vertical ? { bottom: percent } : { left: percent }} />
        </div>
      </div>
    );
  }
}
