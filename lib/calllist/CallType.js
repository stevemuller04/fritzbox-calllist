const CALL_UNKNOWN = 0; // non-standard
const CALL_INCOMING = 1;
const CALL_MISSED = 2;
const CALL_OUTGOING = 3;
const CALL_ACTIVE_INCOMING = 9;
const CALL_REJECTED_INCOMING = 10;
const CALL_ACTIVE_OUTGOING = 11;

module.exports = {
	getString: function(type) {
		switch (type) {
			default: return "unknown";
			case CALL_INCOMING: return "incoming";
			case CALL_MISSED: return "missed";
			case CALL_OUTGOING: return "outgoing";
			case CALL_ACTIVE_INCOMING: return "active incoming";
			case CALL_REJECTED_INCOMING: return "rejected incoming";
			case CALL_ACTIVE_OUTGOING: return "active outgoing";
		}
	},
	isIncoming: function(type) {
		return type == CALL_INCOMING || type == CALL_ACTIVE_INCOMING;
	},
	isOutgoing: function(type) {
		return type == CALL_OUTGOING || type == CALL_ACTIVE_OUTGOING;
	},
	isMissed: function(type) {
		return type == CALL_MISSED;
	},
	isRejected: function(type) {
		return type == CALL_REJECTED_INCOMING;
	},
	isActive: function(type) {
		return type == CALL_ACTIVE_INCOMING || type == CALL_ACTIVE_OUTGOING;
	},
	directionIn: function(type) {
		return type == CALL_INCOMING || type == CALL_MISSED || type == CALL_ACTIVE_INCOMING || type == CALL_REJECTED_INCOMING;
	},
	directionOut: function(type) {
		return type == CALL_OUTGOING || type == CALL_ACTIVE_OUTGOING;
	},
};
