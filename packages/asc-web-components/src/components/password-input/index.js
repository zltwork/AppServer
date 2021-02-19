import React from "react";
import PropTypes from "prop-types";
import equal from "fast-deep-equal/react";

import InputBlock from "../input-block";
import { RefreshIcon } from "./svg";
import Link from "../link";
import Text from "../text";
import Tooltip from "../tooltip";
import { Base } from "../../themes";
import {
  Progress,
  CopyLink,
  NewPasswordButton,
  PasswordProgress,
  StyledInput,
} from "./styled-password-input";

class PasswordInput extends React.Component {
  constructor(props) {
    super(props);

    const { inputValue, inputType, clipActionResource, emailInputName } = props;

    this.ref = React.createRef();
    this.refTooltip = React.createRef();

    this.state = {
      type: inputType,
      progressColor: "transparent",
      progressWidth: 0,
      inputValue: inputValue,
      copyLabel: clipActionResource,
      disableCopyAction: emailInputName ? false : true,
      displayTooltip: false,
      validLength: false,
      validDigits: false,
      validCapital: false,
      validSpecial: false,
    };
  }

  onBlur = () => {
    this.refTooltip.current.hideTooltip();
  };

  changeInputType = () => {
    this.refTooltip.current.hideTooltip();
    const newType = this.state.type === "text" ? "password" : "text";

    this.setState({
      type: newType,
    });
  };

  testStrength = (value) => {
    const { generatorSpecial, passwordSettings } = this.props;
    const specSymbols = new RegExp("[" + generatorSpecial + "]");

    let capital;
    let digits;
    let special;

    passwordSettings.upperCase
      ? (capital = /[A-Z]/.test(value))
      : (capital = true);

    passwordSettings.digits ? (digits = /\d/.test(value)) : (digits = true);

    passwordSettings.specSymbols
      ? (special = specSymbols.test(value))
      : (special = true);

    return {
      digits: digits,
      capital: capital,
      special: special,
      length: value.trim().length >= passwordSettings.minLength,
    };
  };

  checkPassword = (value) => {
    const greenColor = "#44bb00";
    const redColor = "#B40404";
    const passwordValidation = this.testStrength(value);
    const progressScore =
      passwordValidation.digits &&
      passwordValidation.capital &&
      passwordValidation.special &&
      passwordValidation.length;
    const progressWidth =
      (value.trim().length * 100) / this.props.passwordSettings.minLength;
    const progressColor = progressScore
      ? greenColor
      : value.length === 0
      ? "transparent"
      : redColor;

    this.props.onValidateInput && this.props.onValidateInput(progressScore, passwordValidation);

    this.setState({
      progressColor: progressColor,
      progressWidth: progressWidth > 100 ? 100 : progressWidth,
      inputValue: value,
      validLength: passwordValidation.length,
      validDigits: passwordValidation.digits,
      validCapital: passwordValidation.capital,
      validSpecial: passwordValidation.special,
    });
  };

  onChangeAction = (e) => {
    this.props.onChange && this.props.onChange(e);

    if (this.props.simpleView) {
      this.setState({
        inputValue: e.target.value,
      });
      return;
    }

    this.checkPassword(e.target.value);
  };

  onGeneratePassword = (e) => {
    if (this.props.isDisabled) return e.preventDefault();

    const newPassword = this.getNewPassword();

    if (this.state.type !== "text") {
      this.setState({
        type: "text",
      });
    }

    this.checkPassword(newPassword);
    this.props.onChange &&
      this.props.onChange({ target: { value: newPassword } });
  };

  getNewPassword = () => {
    const { passwordSettings, generatorSpecial } = this.props;

    const length = passwordSettings.minLength;
    const string = "abcdefghijklmnopqrstuvwxyz";
    const numeric = "0123456789";
    const special = generatorSpecial;

    let password = "";
    let character = "";

    while (password.length < length) {
      const a = Math.ceil(string.length * Math.random() * Math.random());
      const b = Math.ceil(numeric.length * Math.random() * Math.random());
      const c = Math.ceil(special.length * Math.random() * Math.random());

      let hold = string.charAt(a);

      if (passwordSettings.upperCase) {
        hold = password.length % 2 == 0 ? hold.toUpperCase() : hold;
      }

      character += hold;

      if (passwordSettings.digits) {
        character += numeric.charAt(b);
      }

      if (passwordSettings.specSymbols) {
        character += special.charAt(c);
      }

      password = character;
    }

    password = password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    return password.substr(0, length);
  };

  copyToClipboard = (emailInputName) => {
    const {
      clipEmailResource,
      clipPasswordResource,
      clipActionResource,
      clipCopiedResource,
      isDisabled,
      onCopyToClipboard,
    } = this.props;
    const { disableCopyAction, inputValue } = this.state;

    if (isDisabled || disableCopyAction) return event.preventDefault();

    this.setState({
      disableCopyAction: true,
      copyLabel: clipCopiedResource,
    });

    const textField = document.createElement("textarea");
    const emailValue = document.getElementsByName(emailInputName)[0].value;
    const formattedText =
      clipEmailResource +
      emailValue +
      " | " +
      clipPasswordResource +
      inputValue;

    textField.innerText = formattedText;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();

    onCopyToClipboard && onCopyToClipboard(formattedText);

    setTimeout(() => {
      this.setState({
        disableCopyAction: false,
        copyLabel: clipActionResource,
      });
    }, 2000);
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !equal(this.props, nextProps) || !equal(this.state, nextState);
  }

  // renderTextTooltip = (settings, length, digits, capital, special) => {
  //   return (
  //     <>
  //       <div className="break"></div>
  //       <Text
  //         className="text-tooltip"
  //         fontSize="10px"
  //         color="#A3A9AE"
  //         as="span"
  //       >
  //         {settings.minLength ? length : null}{" "}
  //         {settings.digits ? `, ${digits}` : null}{" "}
  //         {settings.upperCase ? `, ${capital}` : null}{" "}
  //         {settings.specSymbols ? `, ${special}` : null}
  //       </Text>
  //       <div className="break"></div>
  //     </>
  //   );
  // };

  renderTextTooltip = () => {
    const {
      tooltipPasswordLength,
      tooltipPasswordDigits,
      tooltipPasswordCapital,
      tooltipPasswordSpecial,
      passwordSettings,
      isTextTooltipVisible,
    } = this.props;
    return isTextTooltipVisible ? (
      <>
        <div className="break"></div>
        <Text
          className="text-tooltip"
          fontSize="10px"
          color="#A3A9AE"
          as="span"
        >
          {passwordSettings.minLength ? tooltipPasswordLength : null}{" "}
          {passwordSettings.digits ? `, ${tooltipPasswordDigits}` : null}{" "}
          {passwordSettings.upperCase ? `, ${tooltipPasswordCapital}` : null}{" "}
          {passwordSettings.specSymbols ? `, ${tooltipPasswordSpecial}` : null}
        </Text>
        <div className="break"></div>
      </>
    ) : null;
  };

  //  renderTooltipContent = () =>
  //     !isDisableTooltip && !isDisabled ? (
  //       <StyledTooltipContainer forwardedAs="div" title={tooltipPasswordTitle}>
  //         {tooltipPasswordTitle}
  //         <StyledTooltipItem
  //           forwardedAs="div"
  //           title={tooltipPasswordLength}
  //           valid={validLength}
  //         >
  //           {tooltipPasswordLength}
  //         </StyledTooltipItem>
  //         {passwordSettings.digits && (
  //           <StyledTooltipItem
  //             forwardedAs="div"
  //             title={tooltipPasswordDigits}
  //             valid={validDigits}
  //           >
  //             {tooltipPasswordDigits}
  //           </StyledTooltipItem>
  //         )}
  //         {passwordSettings.upperCase && (
  //           <StyledTooltipItem
  //             forwardedAs="div"
  //             title={tooltipPasswordCapital}
  //             valid={validCapital}
  //           >
  //             {tooltipPasswordCapital}
  //           </StyledTooltipItem>
  //         )}
  //         {passwordSettings.specSymbols && (
  //           <StyledTooltipItem
  //             forwardedAs="div"
  //             title={tooltipPasswordSpecial}
  //             valid={validSpecial}
  //           >
  //             {tooltipPasswordSpecial}
  //           </StyledTooltipItem>
  //         )}
  //       </StyledTooltipContainer>
  //     ) : null;

  renderInputGroup = () => {
    const {
      inputName,
      isDisabled,
      scale,
      size,
      hasError,
      hasWarning,
      placeholder,
      tabIndex,
      maxLength,
      theme,
      id,
      autoComplete,
    } = this.props;

    const { type, progressColor, progressWidth, inputValue } = this.state;
    const iconName = type === "password" ? "EyeOffIcon" : "EyeIcon";

    return (
      <>
        <InputBlock
          className="input-relative"
          id={id}
          name={inputName}
          hasError={hasError}
          isDisabled={isDisabled}
          iconName={iconName}
          value={inputValue}
          onIconClick={this.changeInputType}
          onChange={this.onChangeAction}
          scale={scale}
          size={size}
          type={type}
          iconSize={16}
          hoverColor={"#A3A9AE"}
          isIconFill={true}
          onBlur={this.onBlur}
          hasWarning={hasWarning}
          placeholder={placeholder}
          tabIndex={tabIndex}
          maxLength={maxLength}
          autoComplete={autoComplete}
          theme={theme}
        ></InputBlock>
        {/* <TooltipStyle>
        <Tooltip
          id="tooltipContent"
          effect="solid"
          place="top"
          offsetLeft={tooltipOffsetLeft}
          reference={this.refTooltip}
        >
          {this.renderTooltipContent()}
        </Tooltip>
      </TooltipStyle> */}
        <Progress
          progressColor={progressColor}
          progressWidth={progressWidth}
          isDisabled={isDisabled}
        />
      </>
    );
  };
  render() {
    //console.log('PasswordInput render()');
    const {
      emailInputName,
      inputWidth,
      onValidateInput,
      className,
      style,
      simpleView,
      hideNewPasswordButton,
      isDisabled,
    } = this.props;
    const { copyLabel, disableCopyAction } = this.state;

    return (
      <StyledInput
        onValidateInput={onValidateInput}
        className={className}
        style={style}
      >
        {simpleView ? (
          <>
            {this.renderInputGroup()}
            {this.renderTextTooltip()}
          </>
        ) : (
          <>
            <div className="password-field-wrapper">
              <PasswordProgress
                inputWidth={inputWidth}
                data-for="tooltipContent"
                data-tip=""
                data-event="click"
                ref={this.ref}
                isDisabled={isDisabled}
              >
                {this.renderInputGroup()}
              </PasswordProgress>
              {!hideNewPasswordButton ? (
                <NewPasswordButton isDisabled={isDisabled}>
                  <RefreshIcon
                    size="medium"
                    onClick={this.onGeneratePassword}
                  />
                </NewPasswordButton>
              ) : null}
            </div>
            {this.renderTextTooltip()}
            <CopyLink>
              <Link
                type="action"
                isHovered={true}
                fontSize="13px"
                className="password-input_link"
                isSemitransparent={disableCopyAction}
                onClick={this.copyToClipboard.bind(this, emailInputName)}
              >
                {copyLabel}
              </Link>
            </CopyLink>
          </>
        )}
      </StyledInput>
    );
  }
}

PasswordInput.propTypes = {
  id: PropTypes.string,
  autoComplete: PropTypes.string,
  inputType: PropTypes.oneOf(["text", "password"]),
  inputName: PropTypes.string,
  emailInputName: PropTypes.string,
  inputValue: PropTypes.string,
  onChange: PropTypes.func,
  inputWidth: PropTypes.string,
  hasError: PropTypes.bool,
  hasWarning: PropTypes.bool,
  placeholder: PropTypes.string,
  tabIndex: PropTypes.number,
  maxLength: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),

  isDisabled: PropTypes.bool,
  size: PropTypes.oneOf(["base", "middle", "big", "huge", "large"]),
  scale: PropTypes.bool,

  hideNewPasswordButton: PropTypes.bool,
  isDisableTooltip: PropTypes.bool,
  isTextTooltipVisible: PropTypes.bool,

  clipActionResource: PropTypes.string,
  clipEmailResource: PropTypes.string,
  clipPasswordResource: PropTypes.string,
  clipCopiedResource: PropTypes.string,

  tooltipPasswordTitle: PropTypes.string,
  tooltipPasswordLength: PropTypes.string,
  tooltipPasswordDigits: PropTypes.string,
  tooltipPasswordCapital: PropTypes.string,
  tooltipPasswordSpecial: PropTypes.string,

  generatorSpecial: PropTypes.string,
  NewPasswordButtonVisible: PropTypes.bool,
  passwordSettings: PropTypes.object.isRequired,

  onValidateInput: PropTypes.func,
  onCopyToClipboard: PropTypes.func,

  tooltipOffsetLeft: PropTypes.number,

  simpleView: PropTypes.bool,
};

PasswordInput.defaultProps = {
  inputType: "password",
  inputName: "passwordInput",
  autoComplete: "new-password",
  theme: Base,
  isDisabled: false,
  size: "base",
  scale: true,

  hideNewPasswordButton: false,
  isDisableTooltip: false,
  isTextTooltipVisible: false,

  clipEmailResource: "E-mail ",
  clipPasswordResource: "Password ",
  clipCopiedResource: "Copied",

  generatorSpecial: "!@#$%^&*",
  className: "",
  tooltipOffsetLeft: 110,

  simpleView: false,
  passwordSettings: {
    minLength: 8,
    upperCase: false,
    digits: false,
    specSymbols: false,
  },
};

export default PasswordInput;