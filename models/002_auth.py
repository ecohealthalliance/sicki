from gluon.tools import Auth
auth = Auth(db, hmac_key=Auth.get_or_create_key())

auth.settings.registration_requires_verification = False
auth.settings.registration_requires_approval = False
auth.settings.reset_password_requires_verification = True

auth.define_tables ()

admin_role = auth.id_group ("Administrator")
if not admin_role:
    admin_role = auth.add_group ("Administrator", "System Administrator - can access & make changes to any data")

def require_logged_in (func):
    def wrapper (*args, **kwargs):
        if not auth.user:
            redirect (URL (r = request, c = 'default', f = 'user', args = ['login']))
        return func (*args, **kwargs)
    return wrapper

def require_role (role):
    def decorator (func):
        def wrapper (*args, **kwargs):
            if not auth.user:
                redirect (URL (r = request, c = 'default', f = 'user', args = ['login']))
            if not auth.has_membership (role, auth.user.id):
                raise HTTP (401, "Unauthorized")
            return func (*args, **kwargs)
        return wrapper
    return decorator

def logged_in ():
    return auth.user != None

def has_role (role):
    if not logged_in ():
        return False
    return auth.has_membership (role, auth.user.id)

def check_logged_in ():
    return auth.user != None

def check_role (role):
    return 
