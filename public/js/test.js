/**
 * New node file
 */
 $(function () {
	 $(document).ready(function() {
		    
		    var aTags = ["ask","always", "all", "alright", "one", "foo", "blackberry", "tweet","force9", "westerners", "sport"];

		    $( "#tags" ).autocomplete({
		        source: aTags
		    });
		    
		});
 });