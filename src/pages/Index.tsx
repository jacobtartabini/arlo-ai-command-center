import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to dashboard
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="glass rounded-2xl p-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">Arlo AI</h1>
          <p className="text-xl text-muted-foreground">Loading your assistant...</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
