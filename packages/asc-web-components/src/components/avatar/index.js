import React, { memo } from "react";
import PropTypes from "prop-types";

import { GuestIcon, AdministratorIcon, OwnerIcon } from "./svg";
import {
  EditLink,
  EmptyIcon,
  EditContainer,
  AvatarWrapper,
  RoleWrapper,
  NamedAvatar,
  StyledImage,
  StyledAvatar,
} from "./styled-avatar";
import Link from "../link";

const getRoleIcon = (role) => {
  switch (role) {
    case "guest":
      return <GuestIcon size="scale" />;
    case "admin":
      return <AdministratorIcon size="scale" />;
    case "owner":
      return <OwnerIcon size="scale" />;
    default:
      return null;
  }
};

const getInitials = (userName) =>
  userName
    .split(/\s/)
    .reduce((response, word) => (response += word.slice(0, 1)), "")
    .substring(0, 2);

const Initials = (props) => (
  <NamedAvatar {...props}>{getInitials(props.userName)}</NamedAvatar>
);

Initials.propTypes = {
  userName: PropTypes.string,
};

// eslint-disable-next-line react/display-name
const Avatar = memo((props) => {
  //console.log("Avatar render");
  const {
    size,
    source,
    userName,
    role,
    editing,
    editLabel,
    editAction,
  } = props;

  const avatarContent = source ? (
    <StyledImage src={source} />
  ) : userName ? (
    <Initials userName={userName} size={size} />
  ) : (
    <EmptyIcon size="scale" />
  );

  const roleIcon = getRoleIcon(role);

  return (
    <StyledAvatar {...props}>
      <AvatarWrapper source={source} userName={userName}>
        {avatarContent}
      </AvatarWrapper>
      {editing && size === "max" && (
        <EditContainer gradient={!!source}>
          <EditLink>
            <Link
              type="action"
              title={editLabel}
              isTextOverflow={true}
              isHovered={true}
              fontSize="14px"
              fontWeight={600}
              color={whiteColor}
              onClick={editAction}
            >
              {editLabel}
            </Link>
          </EditLink>
        </EditContainer>
      )}
      <RoleWrapper size={size}>{roleIcon}</RoleWrapper>
    </StyledAvatar>
  );
});

Avatar.propTypes = {
  size: PropTypes.oneOf(["max", "big", "medium", "small", "min"]),
  role: PropTypes.oneOf(["owner", "admin", "guest", "user"]),
  source: PropTypes.string,
  editLabel: PropTypes.string,
  userName: PropTypes.string,
  editing: PropTypes.bool,
  editAction: PropTypes.func,

  className: PropTypes.string,
  id: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Avatar.defaultProps = {
  size: "medium",
  role: "",
  source: "",
  editLabel: "Edit photo",
  userName: "",
  editing: false,
};

export default Avatar;