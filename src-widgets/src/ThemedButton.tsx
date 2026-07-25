import React from 'react';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import type VisRxWidget from '@iobroker/types-vis-2/visRxWidget';
import './ThemedButton.css';

interface ButtonRxData {
  oid: string;
  text: string;
  contentMode: string;
  icon: string;
  image: string;
  iconColorInactive: string;
  iconColorActive: string;
  useAccent: boolean;
  invertValue: boolean;
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
              name: 'contentMode',
              label: 'themed_button_content_mode',
              type: 'select',
              default: 'text',
              options: [
                { value: 'text', label: 'themed_button_content_text' },
                { value: 'text-icon', label: 'themed_button_content_text_icon' },
                { value: 'icon', label: 'themed_button_content_icon' },
                { value: 'text-image', label: 'themed_button_content_text_image' },
                { value: 'image', label: 'themed_button_content_image' }
              ]
            },
            {
              name: 'icon',
              label: 'themed_button_icon',
              type: 'icon',
              default: '',
              hidden: 'return data.contentMode !== "icon" && data.contentMode !== "text-icon";'
            },
            {
              name: 'image',
              label: 'themed_button_image',
              type: 'image',
              default: '',
              hidden: 'return data.contentMode !== "image" && data.contentMode !== "text-image";'
            },
            {
              name: 'iconColorInactive',
              label: 'themed_button_icon_color_inactive',
              type: 'color',
              default: '',
              hidden: 'return data.contentMode !== "icon" && data.contentMode !== "text-icon";'
            },
            {
              name: 'iconColorActive',
              label: 'themed_button_icon_color_active',
              type: 'color',
              default: '',
              hidden: 'return data.contentMode !== "icon" && data.contentMode !== "text-icon";'
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
              name: 'invertValue',
              label: 'themed_button_invert_value',
              type: 'checkbox',
              default: false,
              hidden: 'return data.navigateMode;'
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

  private toLogicalValue = (rawValue: boolean): boolean => {
    return this.state.rxData.invertValue ? !rawValue : rawValue;
  };

  private writeLogicalValue = (logicalValue: boolean): void => {
    this.writeValue(this.state.rxData.invertValue ? !logicalValue : logicalValue);
  };

  private onToggle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (this.state.rxData.pushButton) {
      return;
    }

    if (this.state.rxData.navigateMode) {
      this.navigateToView();
      return;
    }

    this.writeLogicalValue(event.target.checked);
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
      const currentRaw = Boolean(this.state.values[`${this.state.rxData.oid}.val`]);
      const currentLogical = this.toLogicalValue(currentRaw);
      this.writeLogicalValue(!currentLogical);
      return;
    }

    this.writeLogicalValue(true);
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
    const value = stateId ? Boolean(this.state.values[`${stateId}.val`]) : false;
    const logicalValue = this.toLogicalValue(value);
    const pushButton = this.state.rxData.pushButton === true;
    const navigateMode = this.state.rxData.navigateMode === true;
    const checked = navigateMode ? (pushButton ? this.state.pushActive : false) : pushButton ? this.state.pushActive : logicalValue;
    const useAccent = this.state.rxData.useAccent !== false;
    const circle = this.state.rxData.circle === true;
    const contentMode = this.state.rxData.contentMode || 'text';
    const icon = (this.state.rxData.icon || '').trim();
    const image = (this.state.rxData.image || '').trim();
    const text = this.state.rxData.text || ThemedButton.t('themed_button_default_text');
    const iconColorInactive = (this.state.rxData.iconColorInactive || '').trim() || '#e0e0e0';
    const iconColorActive = (this.state.rxData.iconColorActive || '').trim() || (useAccent ? '#4ecdc4' : '#e0e0e0');
    const symbolColor = checked ? iconColorActive : iconColorInactive;

    const hasText = contentMode === 'text' || contentMode === 'text-icon' || contentMode === 'text-image';
    const hasIcon = (contentMode === 'icon' || contentMode === 'text-icon') && !!icon;
    const hasImage = (contentMode === 'image' || contentMode === 'text-image') && !!image;

    const iconIsUrlLike = /^(https?:|data:image\/|\/)/.test(icon);
    const iconIsClassName = /\s/.test(icon) || icon.includes('fa-') || icon.includes('material');
    const iconNode = hasIcon ? (
      iconIsUrlLike ? (
        <img className="btn-icon-img" src={icon} alt="" />
      ) : iconIsClassName ? (
        <i className={`btn-icon-symbol ${icon}`} style={{ color: symbolColor }} aria-hidden="true" />
      ) : (
        <span className="btn-icon-symbol" style={{ color: symbolColor }} aria-hidden="true">
          {icon}
        </span>
      )
    ) : null;

    const imageNode = hasImage ? <img className="btn-image" src={image} alt="" /> : null;

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
          <span className={`btn-content ${hasText && (hasIcon || hasImage) ? 'with-media' : ''}`}>
            {hasIcon ? iconNode : null}
            {hasImage ? imageNode : null}
            {hasText ? <span className="btn-text">{text}</span> : null}
          </span>
        </label>
      </div>
    );
  }
}
