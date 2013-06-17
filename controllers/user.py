def index():
    if not auth.user:
        return json.dumps(None)
    else:
        return json.dumps({
                'firstname': auth.user.first_name,
                'lastname': auth.user.last_name,
                'admin': check_role(admin_role)
                })

def login():
    username = request.vars.get('email')
    password = request.vars.get('password')
    result = auth.login_bare(username, password)
    if result:
        return json.dumps({
                'firstname': auth.user.first_name,
                'lastname': auth.user.last_name,
                'admin': check_role(admin_role)
                })
    return json.dumps(False)

def logout():
    if not auth.user:
        return json.dumps(False)
    try:
        auth.logout()
    except:
        pass
    return json.dumps(True)
