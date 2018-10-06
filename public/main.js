$(document).ready(function() {




        var file = undefined;
        var files = [];
        var rez = "*";
        var latitude = 0;
        var longitude = 0;
        var clck = 0;
        var reportClick = 0;
        var lastp = "☕";
        var inUpdate = 0;
        var uid = "pre";
        var us = undefined;
        var provider = new firebase.auth.GoogleAuthProvider();

        var send = function() {
                if (latitude + longitude > 0) {
                        var surl = "pre";
                        if (inUpdate)
                                surl = 'updatePropsals/' + lastp;
                        else
                                surl = 'newProposals/' + (latitude + "x" + longitude).replace(/\./g, 'd');
                        var con = $("#condition")[0].selectedIndex;
                        var txt = $("#txt")[0].value;
                        var imgPath = undefined;
                        var fileUrls = {}
                        var zi = files.length;
                        if (files != undefined && files.length > 0) {
                                for (var fi = 0; fi < files.length; fi++) {
                                        file = files[fi];
                                        var fname = fi.toString() + uid + Date.now().toString() + Math.random().toString();
                                        imgPath = surl + '/' + fname.replace(/\./g, 'd') + file.name;
                                        fileUrls[fi] = imgPath;
                                        var task = storageRef.ref(imgPath).put(file);
                                        task.on('state_changed', function progress(snap) {
                                                        var percent = snap.bytesTransferred * 100 / (snap.totalBytes);
                                                        $("#upp")[0].value = percent;
                                                },
                                                function(error) {
                                                        $("#upp")[0].value = 0; 
                                                        alert("error uploading"); 
                                                },
                                                function complete() {
                                                        zi--;
                                                        if (zi == 0) {
                                                                cleanImages('thumbnail');
                                                                toggleForm(false);
                                                                $('select')[0].className = ''; 
                                                                $('select')[0].selectedIndex = 0;
                                                                $("#txt")[0].value = '';
                                                        }
                                                        $("#upp")[0].value = 0;
                                                });
                                }
                        } else {
                                cleanImages('thumbnail');
                                toggleForm(false);
                                $('select')[0].className = ''; 
                                $('select')[0].selectedIndex = 0;
                                $("#txt")[0].value = '';
                        }
                        firebase.database().ref(surl).set({
                                lat: latitude,
                                lng: longitude,
                                urls: fileUrls,
                                condition: con,
                                text: txt,
                                user: uid
                        });
                } else {
                        alert("location is required");
                }
        }
        $("#submit")[0].onclick = send;
        window.onload = function() {
                //Check File API support
                if (window.File && window.FileList && window.FileReader) {
                        var filesInput = $("#files")[0];

                        filesInput.addEventListener("change", function(event) {
                                var newFiles = event.target.files;
                                if (files == [])
                                        files = newFiles;
                                else
                                        files = Array.prototype.slice.call(files).concat(Array.prototype.slice.call(newFiles));
                                var output = $("#result")[0];
                                for (var i = 0; i < newFiles.length; i++) {
                                        file = newFiles[i];

                                        var img = document.createElement("img");
                                        img.setAttribute("class", "thumbnail");
                                        img.setAttribute("id", "x");
                                        ourl = window.URL.createObjectURL(file);
                                        canvas = $("#canvas")[0];
                                        img.onload = function() {
                                                var ctx = canvas.getContext("2d");
                                                ctx.drawImage(img, 0, 0);
                                                rez = canvas.toDataURL("image/png");
                                        }
                                        img.src = ourl;
                                        output.insertBefore(img, null);

                                }

                        });
                }
        }



        var toggle = function(name, on) {
                var x = document.getElementById(name);  

                var stateWas = x.style.display; 

                $('.pop').hide();
                if  (on ||  stateWas === "none")       
                        x.style.display  = "block";    
                else        
                        x.style.display  = "none";
        };

        var toggleForm = function(isUpdate) {
                file = undefined;
                files = []
                cleanImages("big");
                if (isUpdate) {
                        inUpdate = 1;
                        $(".inform").addClass("inupdate");
                        toggle('form', true);
                        $("#tits")[0].style.display = "none";
                        $(".btn").addClass("bgpurple");
                        $("#submit")[0].innerHTML = "Update";
                } else {
                        inUpdate = 0;
                        //$("#formDesc")[0].style.display="block";
                        $("#tits")[0].style.display = "block";
                        $(".inform").removeClass("inupdate");
                        $(".btn").removeClass("bgpurple");
                        toggle('form', false);
                }
                //$(".inform")[0].style.display="none";
        };
        var toggleFormF = function() {
                toggleForm(false);
        };
        var toggleHelp = function() {
                toggle('help');
                //$("#form")[0].style.display = "none";
        };
        var toggleUser = function() {
                toggle('user');
                if (!us || us.isAnonymous) {
                        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                                .then(function() {
                                        firebase.auth().signInWithRedirect(provider);
                                })
                }

        };



        function gm() {
                var $gallery = $('.gallery a').simpleLightbox();
                return $gallery;
        }
        gal = gm();
        var map = L.map('map').setView([32.07, 34.8], 13);

        var reloc = 1;

        var findMe = L.Control.extend({


                options: {
                        position: 'topleft'
                },
                onAdd: function(map) {
                        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                        container.style.backgroundColor = 'white';
                        container.style.width = '30px';
                        container.style.height = '30px';
                        container.style.backgroundImage = "url('find.png')";
                        container.style.backgroundSize = "30px 30px";
                        container.onclick = function() {
                                reloc = 1;
                        }
                        return container;
                }

        });
        map.addControl(new findMe());

        $("#form")[0].style.display = "none";
        $("#help")[0].style.display = "none";
        $("#user")[0].style.display = "none";

        var post = L.Control.extend({


                options: {
                        position: 'bottomright'
                },
                onAdd: function(map) {
                        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                        container.style.backgroundColor = 'white';
                        container.style.width = '45px';
                        container.style.height = '30px';
                        container.style.backgroundImage = "url('addicon.png')";
                        container.style.backgroundSize = "45px 30px";
                        container.onclick = toggleFormF;
                        return container;
                }

        });
        map.addControl(new post());

        var help = L.Control.extend({
                options: {
                        position: 'bottomleft'
                },
                onAdd: function(map) {
                        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                        container.style.backgroundColor = 'white';
                        container.style.width = '30px';
                        container.style.height = '30px';
                        container.style.backgroundImage = "url('helpicon.jpg')";
                        container.style.backgroundSize = "30px 30px";
                        container.onclick = toggleHelp;
                        return container;
                }
        });
        map.addControl(new help());

        var profile = L.Control.extend({


                options: {
                        position: 'bottomleft'
                },
                onAdd: function(map) {
                        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                        container.style.backgroundColor = 'white';
                        container.style.width = '30px';
                        container.style.height = '30px';
                        container.style.backgroundImage = "url('user.png')";
                        container.style.backgroundSize = "30px 30px";
                        container.onclick = toggleUser;
                        return container;
                }

        });
        map.addControl(new profile());




        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

        }).addTo(map);

        var fIcon = L.icon({
                iconUrl: 'fountain.png',
                shadowUrl: 'blueHalo.png',
                iconSize: [38, 38],
                shadowSize: [60, 110],
                iconAnchor: [19, 5],
                shadowAnchor: [29, 32],
                popupAnchor: [0, -5]
        });



        var m = L.marker([0, 0]).addTo(map)



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
        var db = firebase.database();
        var storageRef = firebase.storage();
        firebase.auth().onAuthStateChanged(function(user) {
                us = user;
                if (user) {
                        uid = user.uid;
                        var scoreRef = database.ref("/users/" + uid);
                        scoreRef.on("value", function(snapshot) {
                                $(".scoretag")[0].innerText = "Score: " + snapshot.val().score;
                        });
                        if (user.isAnonymous) {
                                $(".usertag")[0].innerText = "👽Anonymous User👽";
                                const toast = swal.mixin({
                                        toast: true,
                                        position: 'top',
                                        showConfirmButton: false,
                                        timer: 1500
                                });

                                toast({
                                        type: 'success',
                                        title: '👽'
                                });




                                firebase.auth().getRedirectResult().then(function(result) {
                                        if (result.credential) {
                                                // This gives you a Google Access Token. You can use it to access the Google API.
                                                var token = result.credential.accessToken;
                                                // ...
                                        }
                                        // The signed-in user info.
                                        var user = result.user;
                                        console.log(us.uid);
                                }).catch(function(error) {
                                        console.log("error");
                                });

                        } else {
                                $(".usertag")[0].innerText = "👨" + us.displayName;
                                const toast = swal.mixin({
                                        toast: true,
                                        position: 'top',
                                        showConfirmButton: false,
                                        timer: 1500
                                });

                                toast({
                                        type: 'success',
                                        title: '<img class="circled" src="' + us.photoURL + '" width="40" height="40">'
                                });
                        }

                } else {
                        uid = "off";
                        console.log("off");
                        firebase.auth().signInAnonymously().catch(function(error) {
                                uid = "errr";
                                console.log("errrs");
                        });
                }
        });

        var database = firebase.database();
        var leadsRef = database.ref('/Subs/Locs');
        var markers = new L.MarkerClusterGroup();


        leadsRef.once('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                        var childData = childSnapshot.val();

                        var fbc = "unknown ";
                        var ccolor = "white";
                        switch (Math.round(childData.condition)) {   
                                case  1:
                                        fbc = "good ";
                                        ccolor = "#c2f0c2";       
                                        break;   
                                case  2:
                                        fbc = "ok ";
                                        ccolor = "khaki";       
                                        break;   
                                case 3:
                                        fbc = "bad ";
                                        ccolor = "rgba(255,0,0,0.2)";
                                        break;
                        }

                        var fbtxt = childData.text
                        if (!fbtxt)
                                fbtxt = "";


                        map.on('popupopen', function() {

                                var cont = document.getElementsByClassName('leaflet-popup-content')[0];
                                var lst = cont.getElementsByTagName('script');
                                for (var i = 0; i < lst.length; i++) {
                                        eval(lst[i].innerText)
                                }
                        });

                        var pop = ' <b style="background-color:' + ccolor + ';">' + fbc + 'Condition 💦 </b><br/>' + fbtxt + '<br/><button id="b" style="background-color: #D8BFD8;">Update</button><button id="r" style="background-color: #FFCCCB;">Report</button><script>$("#b").on("click", function(){clck=1; }); $("#r").on("click", function(){reportClick=1; })</script>'

                        var marker = L.marker([childData.lat, childData.lng], {
                                icon: fIcon
                        }).bindPopup(pop);
                        marker.on('click', onClick);
                        markers.addLayer(marker);

                        function onClick(e) {
                                cleanImages('big');
                                lastp = childSnapshot.key;
                                var urlRef = database.ref("/Subs/Locs/" + lastp + "/urls");
                                urlRef.once("value", function(snapshot) {
                                        snapshot.forEach(urlChild => {
                                                if (urlChild.val()["url"] === undefined) {
                                                        storageRef.ref(urlChild.val()).getDownloadURL().then(function(url) { 
                                                                Display(url);
                                                        });
                                                } else {
                                                        storageRef.ref(urlChild.val()["url"]).getDownloadURL().then(function(url) { 
                                                                Display(url);
                                                        })
                                                }
                                        });
                                });
                        }
                });
        });
        map.addLayer(markers);


        function cleanImages(cname) {
                //delete all prev images
                var del = document.getElementsByClassName(cname);
                while (del[0] != null) {
                        del[0].parentNode.removeChild(del[0])
                };
        }

        function Display(url) {


                //for (i = 1; i < 3; i++) { 
                var  img = document.createElement("img");
                img.setAttribute("src", url);
                img.setAttribute("class", "img");
                img.setAttribute("width", "80");
                var  imglink = document.createElement("a");
                imglink.setAttribute("class", "big")

                imglink.setAttribute("href", url);
                imglink.setAttribute("target", "_blank");

                imglink.appendChild(img);
                var  element = $("#g")[0];
                var  child = $("#c1")[0];
                element.insertBefore(imglink, child);
                //}
                gal = gm();
        }

        map.locate({
                enableHighAccuracy: true,
                maxZoom: 16,
                watch: true
        });


        reloc = 1;

        function onLocationFound(e) {
                latitude = e.latlng.lat;
                longitude = e.latlng.lng;
                if (reloc == 1) {

                        map.setView([latitude, longitude], 15);
                        reloc = 0;


                }

                //move user location icon smoothly
                m.slideTo([e.latlng.lat, e.latlng.lng], {
                        duration: 500
                });


                $("#top")[0].style.color = "Lime";
                $("#top")[0].innerHTML = "Local Map";
        }
        map.on('locationfound', onLocationFound);

        function onLocationError(e) {
                $("#top")[0].style.color = "Red";
                $("#top")[0].innerHTML = "No Location, please turn GPS on";
                map.locate({
                        enableHighAccuracy: true,
                        maxZoom: 16,
                        watch: true
                });
        }
        map.on('locationerror', onLocationError);



        function onMapClick(e) {
                cleanImages('big');

        }
        map.on('click', onMapClick);



        function upd() {
                if (clck > 0) {
                        toggleForm(true);
                        inupdate = 1;
                        clck = 0;
                }
                if (reportClick > 0) {
                        var report = {};
                        var random = 0;
                        var rdest = "reports/" + lastp + "/" + uid + Date.now().toString();
                        var pic = undefined;
                        db.ref('/Subs/Locs/' + lastp + "/urls/").once('value', snapshot => {
                                random = Math.floor(Math.random() * snapshot.numChildren());
                                console.log(random);
                                db.ref('/Subs/Locs/' + lastp + "/urls/").once('value', uus => {
                                        pic = uus.val()[random]["url"];
                                        if (pic === undefined)
                                                pic = uus.val()[random];

                                });

                        });
                        report['point'] = lastp;
                        report['time'] = Date.now();
                        report['userID'] = uid;

                        swal({
                                title: 'Does this ⛲ Exist?',
                                text: 'let us know if we should remove it',
                                type: 'question',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No, It\'s missing'
                        }).then((res1) => {

                                if (res1.value == undefined) {
                                        res1.value = false;
                                }
                                report['exist'] = res1.value;
                                if (res1.value) {
                                        swal({
                                                title: 'Are you next to it?',
                                                text: 'help us position it better on the map📍',
                                                type: 'question',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Yes',
                                                cancelButtonText: 'No'
                                        }).then((res2) => {

                                                if (res2.value == undefined) {
                                                        res2.value = false;
                                                }
                                                report['nextToIt'] = res2.value;
                                                report['lat'] = latitude;
                                                report['lng'] = longitude;
                                                const inputOptions = new Promise((resolve) => {
                                                        setTimeout(() => {
                                                                resolve({
                                                                        '1': 'Good',
                                                                        '2': 'OK',
                                                                        '3': 'Bad'
                                                                })
                                                        }, 5)
                                                });


                                                swal({
                                                        title: 'condition?',
                                                        input: 'radio',
                                                        inputOptions: inputOptions,
                                                        inputValidator: function(res3) {
                                                                return new Promise(function(resolve, reject) {
                                                                        if (res3) {
                                                                                resolve();
                                                                        } else {
                                                                                reject('You need to select something!');
                                                                        }
                                                                });
                                                        }

                                                }).then(function(res3) {
                                                        report['condition'] = res3.value;
                                                        storageRef.ref(pic).getDownloadURL().then(function(urlr) {
                                                                swal({
                                                                        title: 'Is this a good photo?',
                                                                        html: '<img src="' + urlr + '" height="420"/>',
                                                                        showCancelButton: true,
                                                                        confirmButtonColor: '#3085d6',
                                                                        cancelButtonColor: '#d33',
                                                                        confirmButtonText: 'Yes',
                                                                        cancelButtonText: 'No',
                                                                }).then((res4) => {
                                                                        if (res4.value == undefined) {
                                                                                res4.value = false;
                                                                        }
                                                                        report['pic'] = {
                                                                                "index": random,
                                                                                "rate": res4.value
                                                                        };
                                                                        swal(
                                                                                'Sucess!',
                                                                                'Thanks for the report!',
                                                                                'success'
                                                                        );

                                                                        firebase.database().ref(rdest).set(report);
                                                                });
                                                        });
                                                });
                                        });
                                } else {
                                        swal(
                                                'Sucess!',
                                                'Thanks for the report!',
                                                'success'
                                        );
                                        firebase.database().ref(rdest).set(report);
                                }

                        });


                        reportClick = 0;
                }
        }
        setInterval(upd, 1000);

        $('#condition')[0].onchange = (function() {
                var optionSelected = $("option:selected", this);
                var valueSelected = this.selectedIndex;



                switch (valueSelected) {   
                        case  1:
                                   $('select')[0].className = 'green';       
                                break;   
                        case  2:
                                       $('select')[0].className = 'yellow';       
                                break;   
                        case 3:
                                    $('select')[0].className = 'red';
                                break;
                }


        });


});
