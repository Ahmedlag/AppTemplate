function Change(Element,Func)
{
	$("body").on("change",Element,Func);
}

function Tap(Element,Func)
{
	$("body").on("tap",Element,Func);
}

function TapHold(Element,Func)
{
	$("body").on("taphold",Element,Func);
}

var Bridge = function(DeviceInfos) {
	
	this.URL = "http://192.168.1.24/in/client/";
	
	//this.Socket = io.connect('http://dev.one:33');
	
	this.log = function(Key,Data)
	{
		
	}
	
	var UserCheck = function(Response)
	{
		if(Response.Status==="LoginLost" || Response.Status==="ClientNotFound")
		   {
				GetPage(LoginPage,function(){
					Loader(0);
				}); 
			   UserLog();
			   return;
		   }

		if(Response.Status==="PhoneNotConfirmed")
		   {
				GetView(ValidatePhoneNumber,function(){

					CloseContainer();

					$("#PhoneInput").val(Response.Data);

				},null,2);
			   return;
		   }
	}
	
	this.Call = function(Key,Data,CallBack)
	{
		
		this.log(Key,Data);
		
		Loader(1);

		$.post({
			url : this.URL,
			data : {
				Device : DeviceInfos,
				Key    : Key,
				Data   : Data
			},
			success  : function(Response)
			{
				console.log(Response);
				
				UserCheck(JSON.parse(Response));
				
				CallBack(JSON.parse(Response),Response);
				
			},
			error : function()
			{
				Loader(0);
				
				
				
				Toast(LangText.unknwenerro,LangText.errortitle,"error");
			}

		});	
	}
	
	this.Post = function(Key,Data,CallBack)
	{
		$.post({
			url : this.URL,
			data : {
				Device : DeviceInfos,
				Key    : Key,
				ClientId : localStorage.ClientId,
				Data   : Data
			},
			success  : function(Response)
			{
				Loader(0);
				
				console.log(Response);
				console.log(JSON.parse(Response));
				UserCheck(JSON.parse(Response));
				
				CallBack(JSON.parse(Response),Response);
				
			},
			error : function()
			{
				Loader(0);
				Toast(LangText.unknwenerro,LangText.errortitle,"error");
			}

		});
	}
	
	this.Sync = function(Key,Data)
	{

	  this.Socket.emit(Key,Data);

	}
	
	this.OnSync = function(Key,CallBack)
	{
	  this.Socket.on(Key,function(Response) {

		  console.log(Response);
		  
		  CallBack(Response);
		  
	   });
	}
	
}
