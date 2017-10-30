// This prevents macro injection for values included in a CSV by prepending some values with a space
// Most resources suggest prepending an apostrophe but Excel has a nasty habit of stripping leading apostrophes out when saving back to CSV files
// Spaces have the benifits of..
//   - Being maintained by Excel
//   - Not interfearing with number parsing (ie. " -100" is still automatically formatted as a number where as "'-100" isn't)
//   - Probably easier to deal with if the CSV file is consumed by another tool (ie. the values can be trimmed before consumption)

const formulaTriggers = ['+', '-', '=', '@'];

function escapeValueForExcel (value) {
	if (formulaTriggers.indexOf(value.toString().slice(0, 1)) > 0) {
		return ' ' + value;
	}
	return value;
};

module.exports = escapeValueForExcel;
