jQuery(function($) {
	/*global move*/
	
	// SORTABLE CLASS
	// ==============
	
	var Sortable = function(table) {
		this.table = table;
		this.$table = $(table);
		this.drag = null;
	};
	
	Sortable.prototype.start = function($row, startEvent) {
		
		var self = this,
			rowWasMoved = false,
			$rows = this.$table.find('tbody tr'),
			$blocker = $('<div class="ui-mouse-blocker move">').appendTo(document.body);
		
		$row.addClass('dragged');
		
		this.rowPositions = this.getRowPositions();
		
		var mousemove = function(e) {
			
			$blocker.css({
				top: e.pageY - 30,
				left: e.pageX - 30
			});
			
			var rowIndex = $row.index(),
				rowHit = self.getRowHit(e);
			
			if (rowHit == -1 || rowHit == rowIndex) {// eslint-disable-line eqeqeq
				return;
			}
			
			var pos = rowHit < rowIndex ? 'Before' : 'After';
			
			$row['insert' + pos]($rows[rowHit]);
			
			$rows = self.$table.find('tbody tr');
			
			rowWasMoved = true;
			
		};
		
		var finish = function(e) {// eslint-disable-line no-unused-vars
			
			$row.removeClass('dragged');
			$blocker.remove();
			$(document).off('mousemove.ui.sortable').off('mouseup.ui.sortable');
			
			if (rowWasMoved) {
				self.$table.trigger('ui.sorted');
				
				$row.find('td').each(function() {
					var td = this;
					$(this).css('background-color', '#fffbdc');
					setTimeout(function() {
						move(td).set('background-color', '').duration('1s').end();
					}, 250);
				});
			}
			
		};
		
		$(document).on('mousemove.ui.sortable', mousemove).on('mouseup.ui.sortable', finish);
		
		mousemove(startEvent);
		
	};
	
	Sortable.prototype.getRowHit = function(e) {
		
		var rowHit = -1;
		
		for (var i = 0; i < this.rowPositions.length; i++) {
			if (e.pageY >= this.rowPositions[i].top && e.pageY <= this.rowPositions[i].bottom) {
				rowHit = i;
				break;
			}
		}
		
		return rowHit;
		
	};
	
	Sortable.prototype.getRowPositions = function() {
		return _.map(this.$table.find('tbody tr'), function(tr) {
			var $tr = $(tr),
				offset = $tr.offset();
			return { top: offset.top, bottom: offset.top + $tr.height() };
		});
	};
	
	// SORTABLE PLUGIN
	// ===============
	
	$.fn.sortable = function($row, e) {
		return this.each(function() {
			var $this = $(this);
			var sortable = $this.data('ui.sortable');
			
			if (!sortable) $this.data('ui.sortable', (sortable = new Sortable(this)));
			
			sortable.start($row, e);
		});
	};
	
	$.fn.sortable.Constructor = Sortable;
	
	// EVENT BINDINGS
	// ==============
	
	$(document).on('mousedown.ui.sortable', '.control-sort', function(e) {
		var $row = $(e.target);
		if (!$row.is('tr')) $row = $row.closest('tr');
		var $table = $row.closest('table');
		$table.sortable($row, e);
		e.preventDefault();
	});
	
});
