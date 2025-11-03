import { Router } from 'express';
import { AuthService } from '../services/auth.service';

const router = Router();
const authService = new AuthService();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await authService.login(username, password);
    res.json(result); // { user, token }
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Erreur inconnue' });
    }
  }
});


export default router;
