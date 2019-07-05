//content-script.js

function alertData(data)
{
    alert(data);
}
function insertArray(_arr)
{
  str="";
    for(var i=0;i<_arr.length;i++)
    {
      str+='{'+
      '"enabled":true,'+
      '"host":"'+_arr[i]+'",'+
      '"protocol":"any"';
      if(i==_arr.length-1)  str+='}';
      else str+='},';
    }
  return str;
}
function toJSON( _in,_out ) {
  var json='{'+
    '"target":{'+
        '"scope":{'+
            '"advanced_mode":true,'+
            '"exclude":['+
                    insertArray(_out)+
            '],'+
            '"include":['+
            insertArray(_in)+
            ']'+
        '}'+
    '}'+
'}';
        console.log(json);
        return json;
}
String.prototype.replaceAll = function(search, replace)
{
    //if replace is not sent, return original string otherwise it will
    //replace search string with 'undefined'.
    if (replace === undefined) {
        return this.toString();
    }

    return this.replace(new RegExp(search , 'g'), replace);
    //return this.replace(search,replace);
};
function toArray(str)
{
  //console.log(str);
  let tempArr=str.split(/\s+/);// /http(s?)\:([a-zA-Z0-9])*/g
  //console.log(tempArr.length);
  let _arr=[];
  let storeNext=false;
  tempArr.map((item,index,array)=>{
    if(item == "Domain" && storeNext==false)
    {
      storeNext=true;
    }
    else if(storeNext==true)
    {
      //alert(item);
      item=item.replaceAll("\\.","#");
      item=item.replaceAll("\\*",".*");
      item=item.replaceAll("http(s)?://","");
      item=item.replaceAll("#","\\\\.");
      //alert(item);
      storeNext=false;
      _arr.push(item);
    }
  });
  return _arr;
}

function prepareData()
{

    var _inScope=document.getElementsByTagName("h4")[0];
    var _outScope=document.getElementsByTagName("h4")[1];

    var inScopeArr=[];
    var outScopeArr=[];
        if( typeof(_inScope)!=='undefined' && _inScope.innerText=="In Scope")
        {
          inScopeArr=toArray(_inScope.nextSibling.innerText);
        }
        if( typeof(_outScope)!=='undefined' && _outScope.innerText=="Out of Scope")
        {
            outScopeArr=toArray(_outScope.nextSibling.innerText);
        }
        //console.log(inText);
        data=toJSON(inScopeArr,outScopeArr);
        alertData(data);
}

function checkState()
{
      switch (document.readyState) {
      case "loading":
        // The document is still loading.
        break;
      case "interactive":
        // The document has finished loading. We can now access the DOM elements.
        // But sub-resources such as images, stylesheets and frames are still loading.
        break;
      case "complete":
        // The page is fully loaded.
        prepareData();
        break;
    }
}

browser.runtime.onMessage.addListener(request => {
  switch (request.query) {
    case "ALERT":
      checkState();
      break;
    default:

  }
});
