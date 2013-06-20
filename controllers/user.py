def index():
    return get_user_model()

def login():
    username = request.vars.get('email')
    password = request.vars.get('password')
    result = auth.login_bare(username, password)
    return get_user_model()

def logout():
    # This try block is because web2py throws a HTTP 304 error in successful logout
    try:
        auth.logout()
    except:
        auth.user = None
    return get_user_model()
