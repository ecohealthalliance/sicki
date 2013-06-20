def get_user_model():
    if not auth.user:
        return json.dumps({
                'firstname': None,
                'lastname': None,
                'admin': False,
                'loggedIn': False
                })
    else:
        return json.dumps({
                'firstname': auth.user.first_name,
                'lastname': auth.user.last_name,
                'admin': check_role(admin_role),
                'loggedIn': True
                })
