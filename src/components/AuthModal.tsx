import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (user: { email: string; name: string }) => void;
}

const AuthModal = ({ open, onOpenChange, onSuccess }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailAuth = async (isSignUp: boolean) => {
    if (!email || !password || (isSignUp && !name)) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      onSuccess({ 
        email, 
        name: name || email.split('@')[0] 
      });
      
      toast({
        title: isSignUp ? "Регистрация успешна!" : "Вход выполнен!",
        description: `Добро пожаловать, ${name || email.split('@')[0]}`,
      });
      
      setIsLoading(false);
      onOpenChange(false);
    }, 1000);
  };

  const handlePhoneAuth = async () => {
    if (!phone) {
      toast({
        title: "Ошибка",
        description: "Введите номер телефона",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      onSuccess({ 
        email: phone, 
        name: phone 
      });
      
      toast({
        title: "Вход выполнен!",
        description: `Добро пожаловать!`,
      });
      
      setIsLoading(false);
      onOpenChange(false);
    }, 1000);
  };

  const handleVKAuth = () => {
    toast({
      title: "VK OAuth",
      description: "Перенаправление на ВКонтакте...",
    });
    
    setTimeout(() => {
      onSuccess({ 
        email: 'vk_user@example.com', 
        name: 'Пользователь VK' 
      });
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-3d shadow-3d-intense">
        <DialogHeader>
          <DialogTitle className="text-2xl text-glow">Вход в StoryForge</DialogTitle>
          <DialogDescription>
            Войдите, чтобы начать создавать истории
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3 shadow-3d">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Телефон</TabsTrigger>
            <TabsTrigger value="social">Соцсети</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="name">Имя (для регистрации)</Label>
              <Input
                id="name"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow-3d"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow-3d"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow-3d"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => handleEmailAuth(false)} 
                disabled={isLoading}
                className="flex-1 shadow-3d-intense"
              >
                {isLoading ? (
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                ) : (
                  <Icon name="LogIn" size={18} className="mr-2" />
                )}
                Войти
              </Button>
              <Button 
                onClick={() => handleEmailAuth(true)} 
                disabled={isLoading}
                variant="outline"
                className="flex-1 shadow-3d"
              >
                Регистрация
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="phone">Номер телефона</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="shadow-3d"
              />
            </div>

            <Button 
              onClick={handlePhoneAuth} 
              disabled={isLoading}
              className="w-full shadow-3d-intense"
            >
              {isLoading ? (
                <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
              ) : (
                <Icon name="Smartphone" size={18} className="mr-2" />
              )}
              Получить код
            </Button>
          </TabsContent>

          <TabsContent value="social" className="space-y-3 animate-fade-in">
            <Button 
              onClick={handleVKAuth}
              className="w-full shadow-3d-intense bg-[#0077FF] hover:bg-[#0066DD]"
            >
              <Icon name="Globe" size={18} className="mr-2" />
              Войти через ВКонтакте
            </Button>

            <Button 
              onClick={handleVKAuth}
              variant="outline"
              className="w-full shadow-3d"
            >
              <Icon name="Mail" size={18} className="mr-2" />
              Войти через Яндекс
            </Button>

            <Button 
              onClick={handleVKAuth}
              variant="outline"
              className="w-full shadow-3d"
            >
              <Icon name="Github" size={18} className="mr-2" />
              Войти через Telegram
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
