function ()
{
    try
    {
        // clear star btn
        document.getElementById('star_btn').parentNode.removeChild(document.getElementById('star_btn'));

        // clear personal panel
        document.getElementById('personal_card').parentNode.removeChild(document.getElementById('personal_card'));

        // extend to full page the content
        document.getElementById('main_col').className = 'col-lg-12 col-md-12 col-sm-12';
        document.getElementById('main_col').style.paddingRight = '0px';

        console.log("Android App - personal card removed");
    }
    catch (error)
    {
        console.log('Android App - personal card not found');
    }
}