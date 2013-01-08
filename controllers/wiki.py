def blog():
    if not (request.args (0) == 'edit'):
        redirect (URL (r = request, c = 'default', f = 'index'))
    return render_page ()

def case():
    return render_page ()

def tutorials():
    return render_page ()

def docs():
    return render_page ()
    

