jQuery(function($) {
  // Google Maps for Location Field.
  // Main Object
  var maps_in_a_page = {
    maps:[]
  };

  function openMap(gmapObject) {
    //Get current value or use default value
    lat = 3.08737
    if (gmapObject.$getLat.val())
      lat = gmapObject.$getLat.val()

    lng = 101.59871
    if (gmapObject.$getLng.val())
      lng = gmapObject.$getLng.val()

    //Create GMaps object based on the canvas id
    gmapObject.gmap = new GMaps({
      div: gmapObject.canvas,
      lat: lat,
      lng: lng,
      zoom: 5,
      zoomControl: true,
      zoomControlOpt: {
        style: 'SMALL',
        position: 'TOP_LEFT'
      }
    });

    var current_map = gmapObject.gmap;

    // Add markers when first init the map.
    current_map.addMarker({
      lat: lat,
      lng: lng,
    })

    // Marker_added event being attached to a single/particular GMaps object
    GMaps.on('marker_added', current_map, function(marker) {
      getLat = gmapObject.$getLat
      getLat.val(marker.getPosition().lat())
      getLng = gmapObject.$getLng
      getLng.val(marker.getPosition().lng())
    });

    // on click event being attached to a single/particular GMaps object
    GMaps.on('click', current_map.map, function(event) {
      current_map.removeMarkers();
      var lat = event.latLng.lat();
      var lng = event.latLng.lng();
      current_map.addMarker({
        lat: lat,
        lng: lng
      });
      current_map.setCenter(lat, lng);
    });
  }

  $('.field.type-location').each(function(i,v) {
    var $field = $(this),
      $extras = $field.find('.extras'),
      visible = 0;

    gmaps = {};
    gmaps.canvas = 'mapArea_'+i; //name the canvas based on index
    gmaps.$f = $field;
    gmaps.$getLat = $field.find("input[placeholder='Latitude']");
    gmaps.$getLng = $field.find("input[placeholder='Longitude']");
    maps_in_a_page.maps.push(gmaps); //add to the main object

    
    if (visible >= $extras.length) {
      $field.find('.btn-show-map').remove();
    } else {
      $field.find('.btn-show-map').on('click', function() {
        $(this).remove();
        current_map =  _.findWhere(maps_in_a_page.maps, {
          $f:$field
        });
        $field.find('.map').append('<div id="'+current_map.canvas+'" class="map_canvas"><div>');
        openMap(current_map);
        $(window).trigger('redraw');
      })
    }
  });

});