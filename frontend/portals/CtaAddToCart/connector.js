import { connect } from 'react-redux';
import { getIsRechargeOptional } from '../../selectors';

/**
 * @param {Object} state state
 * @param {Objec} props props
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  isRechargeOptional: getIsRechargeOptional(state, props),
});

export default connect(mapStateToProps);
