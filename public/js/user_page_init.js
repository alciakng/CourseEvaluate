/**
 * New node file
 */



$(document).ready(function(){
    table_init();
    logout_init();
    
});

//logout_init
function logout_init(){
    
    $('#logout').click(function(){
        location.replace('/logout'); 
    });
    
}

//table_init
function table_init() {
    
    //coulmn filter 생성
 
    //ajax call 후에 data로 data-table 생성 및 column search available
    $.ajax({
             url:'/courseLoad',
             dataType:'json',
             type:'GET', 
             success:function(result){
             var table= $('#course').DataTable({
                      "data": result,
                      //search input 라벨 제거
                      "oLanguage": { "sSearch": "" },
                      //dom option dom배치 결정
                      "dom": '<"wrapper"rtp>',
                      "columnDefs": [ { "targets": 4, "orderable": false } ],
                     //reponsive option 
             });
             
             
               $('#course thead th').each( function () { 
                   var title = $('#course thead th').eq( $(this).index() ).text();
                  if($(this).index()!=4)
                  $(this).html('<input type="text" style="width:100%" placeholder='+title+'/>');
              
                 });
     
             
             
             table.columns().eq( 0 ).each( function ( colIdx ) {
                 $('input', table.column( colIdx ).header() ).on('keyup change', function () {
                     table
                     .column(colIdx)
                     .search(this.value)
                     .draw();
                 });
               });                   
             }
             
     });
};
