function ()
{
    try
    {
        document.getElementById('personal_card').parentNode.removeChild(document.getElementById('personal_card'));
        console.log('Android App - personal card removed');

        document.getElementById('star_btn').parentNode.removeChild(document.getElementById('star_btn'));
        console.log('Android App - star button removed');

        document.getElementById('main_col').className = 'col-lg-12 col-md-12 col-sm-12';
        document.getElementById('main_col').style.paddingRight = '0px';
    }
    catch (error)
    {
        console.log('Android App - personal card not found');
    }

    try
    {
        document.getElementById('hebrew_flag').parentNode.removeChild(document.getElementById('hebrew_flag'));
        console.log('Android App - Hebrew Flag Link removed');

        document.getElementById('russian_flag').parentNode.removeChild(document.getElementById('russian_flag'));
        console.log('Android App - Russian Flag Link removed');
    }
    catch (error)
    {
        console.log('Android App - Hebrew or Russian Flag Link not found');
    }
}