const { supabase } = require('../config/supabase');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_NO_TOKEN', message: 'Authorization token required' }
      });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_INVALID_TOKEN', message: 'Invalid or expired token' }
      });
    }

    // Attach user to request
    req.user = user; 
    
    // Attempt to fetch custom role from database, fallback to 'customer'
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profile) {
      req.user.role = profile.role;
    } else {
      req.user.role = 'customer';
    }

    next();
  } catch (err) {
    next(err);
  }
};

const requireRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: { code: 'PERM_FORBIDDEN', message: 'You do not have permission for this action' }
    });
  }
  next();
};

module.exports = { authenticate, requireRole };
