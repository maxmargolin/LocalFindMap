  $(document).ready(function() {
	
		var rez="*" ;
 var latitude=0;
 var longitude=0;
 
 var send =function() {
 	cleanImages('thumbnail'); toggleForm();
 	
 	
 	if(latitude+longitude>0) firebase.database().ref('Subs/Locs/'+ (latitude+ "x"+longitude).replace(/\./g,'d')).set({
    lat: latitude, 
    lng: longitude, 
    data: rez
  });
  else
  alert("noloc");
  
 	} 
 	document.getElementById("submit" ).onclick=send;
 window.onload = function() {
  //Check File API support
  if (window.File && window.FileList && window.FileReader) {
    var filesInput = document.getElementById("files");

    filesInput.addEventListener("change", function(event) {

      var files = event.target.files; //FileList object
      
      
      
      var output = document.getElementById("result");

      for (var i = 0; i < files.length; i++) {
        var file = files[i];

         

         var img = document.createElement("img");
          
       img.setAttribute("class", "thumbnail");
       
         img.setAttribute("id", "x");
       img.src=window.URL.createObjectURL(file);     output.insertBefore(img, null);
      
         canvas=document.getElementById("canvas");
         var ctx = canvas.getContext("2d");
         
         var imgg = new Image();
         
          imgg.onload = function(){ ctx.drawImage(imgg, 0, 0) } 
          
          imgg.src = URL.createObjectURL(img.src);
         
       
         alert("not" ) ;
        
alert(img.src) ;
         alert(imgg.src) ;
    
         
      }

    });
  }
}


    
 var toggle = function(name){
      var x=document.getElementById(name);
    if (x.style.display ==="none") 
        x.style.display ="block";
     else 
        x.style.display ="none";
    
    };
   
 var toggleForm = function(){
      toggle('form') ;
      document.getElementById("help").style.display="none";
    };
var toggleHelp = function(){
      toggle('help') ;
      document.getElementById("form").style.display="none";
    }; 
    
 
function gm(){
var $gallery = $('.gallery a').simpleLightbox();
return $gallery;
}
gal=gm();
			var map = L.map('map').setView([32.07, 34.8], 13);
			
			var reloc=1;
  
var findMe = L.Control.extend({
 
  
  options: {
    position: 'topleft' 
  },
  onAdd: function (map) {
  var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
  container.style.backgroundColor = 'white' ;
    container.style.width = '30px';
    container.style.height = '30px';
    container.style.backgroundImage = "url('find.png')";
  container.style.backgroundSize = "30px 30px";
    container.onclick = function(){
      reloc=1;
    }
    return container;
} 
 
});
			map.addControl(new findMe());
			
			$("#form")[0].style.display = "none";
			document.getElementById("help").style.display = "none";
			
			var post = L.Control.extend({
 
  
  options: {
    position: 'bottomright' 
  },
  onAdd: function (map) {
  var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
  container.style.backgroundColor = 'white' ;
    container.style.width = '45px';
    container.style.height = '30px';
    container.style.backgroundImage = "url('rcam.png')";
  container.style.backgroundSize = "45px 30px";
    container.onclick = toggleForm ;
    return container;
} 
 
});
			map.addControl(new post());
			
			var help = L.Control.extend({
 
  
  options: {
    position: 'bottomleft' 
  },
  onAdd: function (map) {
  var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
  container.style.backgroundColor = 'white' ;
    container.style.width = '30px';
    container.style.height = '30px';
    container.style.backgroundImage = "url('h.jpg')";
  container.style.backgroundSize = "30px 30px";
    container.onclick = toggleHelp ;
    return container;
} 
 
});
			map.addControl(new help());
			
			 document.getElementById("top").style.color="White";


			L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
			 attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

			}).addTo(map);

			 var fIcon = L.icon({ iconUrl: 'fountain.png', shadowUrl: 'bg.png', iconSize: [38, 38],  shadowSize: [60,110],  iconAnchor: [19, 5],  shadowAnchor: [29, 32],  popupAnchor: [0, - 5]
			 });
			 
			
			 
var m=L.marker([0,0]).addTo(map)

	
	
	  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCp2Sc007OL7lYzNgnLu-bU1dH0NhYv3K4",
    authDomain: "mekomit-8bc02.firebaseapp.com",
    databaseURL: "https://mekomit-8bc02.firebaseio.com",
    projectId: "mekomit-8bc02",
    storageBucket: "mekomit-8bc02.appspot.com",
    messagingSenderId: "195107121159"
  };
  firebase.initializeApp(config);
	var database = firebase.database();
	var leadsRef = database.ref('/Subs/Locs'); leadsRef.on('value', function(snapshot) { snapshot.forEach(function(childSnapshot) { var childData = childSnapshot.val(); 
			 marker = L.marker([childData.lat, childData.lng], {icon: fIcon}) .addTo(map). bindPopup('<b> Good Condition💦 </b><br>water bottle fits');
			 marker.on('mouseover',onClick);
function onClick(e) {
	if(childData.data!=undefined){ 
	//Display("rc") 
	   var imgg= document.createElement("img");
          imgg.src =rez ;// childData.data;
          alert(imgg.src.length);
          
         imgg.setAttribute("id","special") ;
         document.getElementById("x").src=childData.data;
         //insertBefore(imgg,document.getElementById("submit")); 
   }      
} 
		}); });

	
	 
	 function cleanImages(cname) {
	 			//delete all prev images
	var del = document.getElementsByClassName(cname);
	while(del[0]!=null) {	del[0].parentNode.removeChild(del[0])
	} ;
	} 
	
	 function Display(base){-
	 cleanImages('big');
	
	for (i = 1; i < 3; i++) { 
    var img = document.createElement("img");
     img.setAttribute("src",base+i+".jpeg");
 img.setAttribute("class","img");
  img.setAttribute("width","80"); var imglink=document.createElement("a");
    imglink.setAttribute("class","big")
imglink.setAttribute("href", base+i+".jpeg");
imglink.appendChild(img);
var element = document.getElementById("g");
var child = document.getElementById("c1");
element.insertBefore(imglink, child);
} 
gal =gm() ;

	 	} 
	 
			 map.locate({enableHighAccuracy:true, maxZoom: 16, watch:true});
			 
			
			 reloc=1;
	
function onLocationFound(e) { 

latitude=e.latlng.lat;
longitude=e.latlng.lng;
if(reloc==1){
	map.setView([latitude, longitude], 15);
reloc=0;

} 
	
	
	m.slideTo(	[e.latlng.lat,e.latlng.lng], {
    duration: 500
});

	
	
	document.getElementById("top").style.color="Lime";
	document.getElementById("top").innerHTML="Local Map";
 } 
 map.on('locationfound', onLocationFound); 

function onLocationError(e) { 
document.getElementById("top").style.color="Red";
document.getElementById("top").innerHTML="No Location, please turn GPS on";
map.locate({enableHighAccuracy:true, maxZoom: 16, watch:true});
} map.on('locationerror', onLocationError);



function onMapClick(e) { cleanImages('big'); } 
map.on('click', onMapClick);
	
	});
		
