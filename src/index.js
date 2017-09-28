import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class ConfirmButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is: 'active',
    };
    this.onClickToggleState = this.handleClick.bind(this);
    this.onClick = (props.onClick ? props.onClick.bind(this) : () => {});
    if (props.onConfirm) {
      this.onConfirm = props.onConfirm.bind(this);
    } else if (props.confirming && props.confirming.onClick) {
      this.onConfirm = props.confirming.onClick.bind(this);
    } else {
      this.onConfirm = () => {};
    }
    // while confirming, when confirmed & disabling
    this.onDisable = (props.onDisable ? props.onDisable.bind(this) : () => {});
  }
  handleClick() {
    const { disableAfterConfirmed } = this.props;
    if (this.isConfirming() && disableAfterConfirmed) {
      // have confirmed and are now disabled
      this.onConfirm();
      this.onDisable();
      this.setState({ is: 'disabled' });
      return;
    }
    if (this.isConfirming()) {
      // we are clicking into the active state (from confirming)
      //   loop around to the beginning...
      this.onConfirm();
      this.setState({ is: 'active' });
      return;
    }
    // we are clicking into the confirming state (from active)
    this.onClick();
    this.setState({ is: 'confirming' });
  }
  isDisabled() {
    return this.state.is === 'disabled';
  }
  isConfirming() {
    return this.state.is === 'confirming';
  }
  isActive() {
    return (!this.isConfirming() && !this.isDisabled());
  }
  render() {
    const {
      disableAfterConfirmed,
      children, // always shows
      buttonProps,
      // confirming config
      confirming,
      // disabled config
      disabled,
      // optional configurations
      asLink,
    } = this.props;
    let {
      // active state
      text,
      style,
      className = 'btn btn-danger',
    } = this.props;

    const isDisabled = this.isDisabled();
    const isConfirming = this.isConfirming();
    const isActive = this.isActive();

    if (isDisabled) {
      text = disabled && disabled.text || 'Loading...';
      className = disabled && disabled.className || 'btn btn-secondary';
      style = disabled && disabled.style || {};
    }
    if (isConfirming) {
      text = confirming && confirming.text || 'Confirm?';
      className = confirming && confirming.className || 'btn btn-warning';
      style = confirming && confirming.style || {};
    }

    if (asLink) {
      return (
        <a
          className={classnames('confirm-button', className)}
          style={style}
          onClick={this.onClickToggleState}
          disabled={isDisabled}
          {...buttonProps}
        >
          {children}
          {children ? ' ' : ''}
          {text}
        </a>
      );
    }

    return (
      <button
        className={classnames('confirm-button', className)}
        style={style}
        onClick={this.onClickToggleState}
        disabled={isDisabled}
        {...buttonProps}
      >
        {children}
        {children ? ' ' : ''}
        {text}
      </button>
    );
  }
}
ConfirmButton.propTypes = {
  // if true, we will disable the button after confirming & disabled
  // if false || empty, we will loop around and allow click & confirm again
  disableAfterConfirmed: PropTypes.bool,
  // user passed in function - on confirmation
  onConfirm: PropTypes.func,
  // user passed in function - on disable, after onConfirm
  onDisable: PropTypes.func,
  // user passed in function - on click, before confirmation
  onClick: PropTypes.func,
  // displayed normally, before confirming, while active
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  className: PropTypes.string,
  style: PropTypes.object,
  // displayed only while confirming
  confirming: PropTypes.shape({
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    className: PropTypes.string,
    style: PropTypes.object,
    // alias for onConfirm (convenience)
    onClick: PropTypes.func,
  }),
  // displayed only after confirmed (clicked twice, disabled)
  disabled: PropTypes.shape({
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    className: PropTypes.string,
    style: PropTypes.object,
  }),
  // children always displayed (optional)
  children: PropTypes.node,
  // custom props to pass into button
  buttonProps: PropTypes.object,
  // as link <a> instead of button
  asLink: PropTypes.bool,
};
ConfirmButton.defaultProps = {
  buttonProps: {
    role: 'button',
  },
};

