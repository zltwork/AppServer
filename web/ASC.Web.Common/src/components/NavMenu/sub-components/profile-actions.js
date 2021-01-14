import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Avatar, DropDownItem, Link } from "asc-web-components";
import ProfileMenu from "../../ProfileMenu";
import store from "../../../store";

const { getHeaderVisible, getIsTabletView } = store.auth.selectors;
class ProfileActions extends React.PureComponent {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.state = {
      opened: props.opened,
      user: props.user,
    };
  }

  setOpened = (opened) => {
    this.setState({ opened: opened });
  };

  componentDidUpdate(prevProps, prevState) {
    const { isHeaderVisible, isTabletView } = this.props;
    if (this.props.user !== prevProps.user) {
      this.setState({ user: this.props.user });
    }

    if (this.props.opened !== prevProps.opened) {
      this.setOpened(this.props.opened);
    }
    if (this.state.opened !== prevState.opened) {
      console.log("isHeaderVisible", isHeaderVisible);
      isTabletView &&
        isHeaderVisible &&
        this.props.isOpenProfileMenu(this.state.opened);
    }
  }

  getUserRole = (user) => {
    let isModuleAdmin = user.listAdminModules && user.listAdminModules.length;

    if (user.isOwner) return "owner";
    if (user.isAdmin || isModuleAdmin) return "admin";
    if (user.isVisitor) return "guest";
    return "user";
  };

  onClose = (e) => {
    if (this.ref.current.contains(e.target)) return;

    this.setOpened(!this.state.opened);
  };

  onClick = (action, e) => {
    action.onClick && action.onClick(e);

    this.setOpened(!this.state.opened);
  };

  onClickItemLink = (e) => {
    this.setOpened(!this.state.opened);

    e.preventDefault();
  };

  render() {
    //console.log("Layout sub-component ProfileActions render");
    const { user, opened } = this.state;
    const userRole = this.getUserRole(user);

    return (
      <div ref={this.ref}>
        <Avatar
          onClick={this.onClick}
          role={userRole}
          size="small"
          source={user.avatar}
          userName={user.displayName}
        />
        <ProfileMenu
          className="profile-menu"
          avatarRole={userRole}
          avatarSource={user.avatarMedium}
          displayName={user.displayName}
          email={user.email}
          open={opened}
          clickOutsideAction={this.onClose}
        >
          <div style={{ paddingTop: "8px" }}>
            {this.props.userActions.map((action) => (
              <Link
                noHover={true}
                key={action.key}
                href={action.url}
                onClick={this.onClickItemLink}
              >
                <DropDownItem {...action} />
              </Link>
            ))}
          </div>
        </ProfileMenu>
      </div>
    );
  }
}

ProfileActions.propTypes = {
  opened: PropTypes.bool,
  user: PropTypes.object,
  userActions: PropTypes.array,
};

ProfileActions.defaultProps = {
  opened: false,
  user: {},
  userActions: [],
};
function mapStateToProps(state) {
  return {
    isHeaderVisible: getHeaderVisible(state),
    isTabletView: getIsTabletView(state),
  };
}
export default connect(mapStateToProps)(ProfileActions);
