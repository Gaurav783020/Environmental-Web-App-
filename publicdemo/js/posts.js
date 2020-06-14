fetch('http://122.176.120.160:5001/getallposts')
  .then(response => response.json())
  .then(data =>{

   
        
   

  var m= data["data"];

var l=m.length;
if(l==0){
$("No Posts Availaible Right Now").appendTo('#outerdiv');
}
else{
    
for(var i=m.length-1;i>=0;i--){


  var x = '<div class="top-content"><img src="./user.jpg" alt="user image"/><p>'+m[i]["Filename"]+'</p></div>';
  x=x+'<div class="mid-content"> <p>'+ m[i]["Message"]+' @Date : '+ m[i]["Eventdate"]+' @Time : ' + m[i]["Eventtime"]+'</p><p> Location : '+ m[i]["Address"]+', '+ m[i]["City"]+', '+m[i]["District"]+', '+m[i]["State"]+'.'+'</div>';
    x=x+'<div class="bottom-content"> <img src="data:image/png;base64,'+m[i]["image"]+'" height="316px"/><div class="btns">  <button type="button" id="'+m[i]["Name"]+'" onclick="like(this.id)" >Interested   '+m[i]["likes"]+'</button><button id="'+m[i]["Name"]+'" onclick="dislike(this.id)">NotInterested   '+m[i]["dislikes"]+'</button></div></div>';

  $(x).appendTo('#outerdiv');
  

}

}
  });

       

  function like(id){
      var m='http://122.176.120.160:5001/like/'+id;
    fetch(m)
    .then(response => response.json())
    .then(data =>{


    })  
  }

  function dislike(id){
       var m='http://122.176.120.160:5001/dislike/'+id;
    fetch(m)
    .then(response => response.json())
    .then(data =>{
        
        // console.log(data["dislikes"]);

      

    })  
  }