import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const Settings = () => {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-6">Настройки</h2>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Brain" size={24} />
              Модель ИИ
            </CardTitle>
            <CardDescription>
              Выберите модель для генерации ответов
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Основная модель</Label>
              <Select defaultValue="claude-sonnet">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude-haiku">Claude Haiku (Быстрая)</SelectItem>
                  <SelectItem value="claude-sonnet">Claude Sonnet (Сбалансированная)</SelectItem>
                  <SelectItem value="claude-opus">Claude Opus (Мощная)</SelectItem>
                  <SelectItem value="gpt-4">GPT-4 (OpenAI)</SelectItem>
                  <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="creativity">Креативность</Label>
                <span className="text-sm text-muted-foreground">0.7</span>
              </div>
              <Slider
                id="creativity"
                defaultValue={[0.7]}
                max={1}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Высокие значения делают ответы более творческими и непредсказуемыми
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="response-length">Длина ответов</Label>
                <span className="text-sm text-muted-foreground">Средняя</span>
              </div>
              <Select defaultValue="medium">
                <SelectTrigger id="response-length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Короткие (50-100 слов)</SelectItem>
                  <SelectItem value="medium">Средние (100-200 слов)</SelectItem>
                  <SelectItem value="long">Длинные (200-400 слов)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Image" size={24} />
              Изображения
            </CardTitle>
            <CardDescription>
              Настройки генерации изображений
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-images">Автоматическая генерация</Label>
                <p className="text-sm text-muted-foreground">
                  Создавать изображения для ключевых событий
                </p>
              </div>
              <Switch id="auto-images" defaultChecked />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Генератор изображений</Label>
              <Select defaultValue="stable-diffusion">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                  <SelectItem value="midjourney">Midjourney</SelectItem>
                  <SelectItem value="dall-e">DALL-E 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Settings" size={24} />
              Общие
            </CardTitle>
            <CardDescription>
              Дополнительные настройки приложения
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notifications">Уведомления</Label>
                <p className="text-sm text-muted-foreground">
                  Получать уведомления о событиях
                </p>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="sound">Звуковые эффекты</Label>
                <p className="text-sm text-muted-foreground">
                  Воспроизводить звуки интерфейса
                </p>
              </div>
              <Switch id="sound" />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="animations">Анимации</Label>
                <p className="text-sm text-muted-foreground">
                  Включить плавные переходы
                </p>
              </div>
              <Switch id="animations" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
