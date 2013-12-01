jQuery(function($) {
  // Google Maps for Location Field.
  (function() {
    $(document).ready(function() {
        maps_canvas = $("div[id$='geo_map_canvas']");
        map_array = [];

        maps_canvas.each(function(index, canvas) {

          map_id = canvas.id.replace('_map_canvas', '')
          getLat = $("input[name='" + map_id + "'][placeholder='Latitude']")
          getLng = $("input[name='" + map_id + "'][placeholder='Longitude']")

          //Get current value or use default value
          lat = 3.08737
          if (getLat.val())
            lat = getLat.val()

          lng = 101.59871
          if (getLng.val())
            lng = getLng.val()

          //Create GMaps object based on the canvas id
          map_array.push(new GMaps({
            div: canvas.id,
            lat: lat,
            lng: lng,
            zoom: 5,
            zoomControl: true,
            zoomControlOpt: {
              style: 'SMALL',
              position: 'TOP_LEFT'
            }
          }));
          current_map = _.last(map_array);
         

          // Add markers when first init the map.
          current_map.addMarker({
            lat: lat,
            lng: lng,
          })

          // Marker_added event being attached to a single/particular GMaps object
          GMaps.on('marker_added', current_map, function(marker) {
            getDiv = this.getDiv().id;
            id = getDiv.replace('_map_canvas', '')
            getLat = $("input[name='" + id + "'][placeholder='Latitude']")
            getLat.val(marker.getPosition().lat())
            getLng = $("input[name='" + id + "'][placeholder='Longitude']")
            getLng.val(marker.getPosition().lng())
          });

          // on click event being attached to a single/particular GMaps object
          GMaps.on('click', current_map.map, function(event) {
            gmap = _.findWhere(map_array, {
              el: this.b
            })
            gmap.removeMarkers();
            var index = gmap.markers.length;
            var lat = event.latLng.lat();
            var lng = event.latLng.lng();
            gmap.addMarker({
              lat: lat,
              lng: lng
            });
          });
          console.log(maps_canvas)
        });
    });
  })();
});