import { connect } from 'react-redux';
import { getSelectedSubscriptionsInfo } from '../../selectors';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  rechargeInfo: getSelectedSubscriptionsInfo(state, props),
});

export default connect(mapStateToProps);
