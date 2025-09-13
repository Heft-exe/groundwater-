import { useState } from 'react';
import { User, Settings, Bell, Moon, Sun, Palette, Type, Shield, Edit2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { toast } from "sonner@2.0.3";

interface UserProfile {
  username: string;
  email: string;
  fullName: string;
  organization: string;
}

export function Profile() {
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeFonts, setLargeFonts] = useState(false);
  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    warningAlerts: true,
    systemUpdates: false,
    weeklyReports: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    username: 'groundwater_admin',
    email: 'admin@wgt-monitoring.gov.in',
    fullName: 'Dr. Rajesh Kumar',
    organization: 'Central Ground Water Board'
  });
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const toggleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    toast.success(`${enabled ? 'Dark' : 'Light'} mode enabled`);
  };

  const toggleHighContrast = (enabled: boolean) => {
    setHighContrast(enabled);
    toast.success(`High contrast mode ${enabled ? 'enabled' : 'disabled'}`);
  };

  const toggleLargeFonts = (enabled: boolean) => {
    setLargeFonts(enabled);
    toast.success(`Large fonts ${enabled ? 'enabled' : 'disabled'}`);
  };

  const updateNotificationSetting = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success("Notification preferences updated");
  };

  return (
    <div className="pb-20 min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-4 pt-12">
        <div className="flex items-center gap-2 mb-2">
          <User className="h-5 w-5" />
          <h1 className="text-white">Profile & Settings</h1>
        </div>
        <p className="text-primary-foreground/80 text-sm">Manage your account and preferences</p>
      </div>

      <div className="p-4 -mt-4">
        {/* Profile Information */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Profile Information</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs"
              >
                {isEditing ? <X className="h-3 w-3 mr-1" /> : <Edit2 className="h-3 w-3 mr-1" />}
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" alt={profile.fullName} />
                <AvatarFallback className="text-lg bg-primary text-white">
                  {profile.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-primary">{profile.fullName}</h3>
                <p className="text-sm text-gray-600">{profile.organization}</p>
                <p className="text-xs text-gray-500">Groundwater Specialist</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-xs text-gray-600">Full Name</Label>
                {isEditing ? (
                  <Input
                    value={editedProfile.fullName}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, fullName: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm">{profile.fullName}</p>
                )}
              </div>

              <div>
                <Label className="text-xs text-gray-600">Username</Label>
                {isEditing ? (
                  <Input
                    value={editedProfile.username}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, username: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm">{profile.username}</p>
                )}
              </div>

              <div>
                <Label className="text-xs text-gray-600">Email</Label>
                {isEditing ? (
                  <Input
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                    type="email"
                  />
                ) : (
                  <p className="mt-1 text-sm">{profile.email}</p>
                )}
              </div>

              <div>
                <Label className="text-xs text-gray-600">Organization</Label>
                {isEditing ? (
                  <Input
                    value={editedProfile.organization}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, organization: e.target.value }))}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm">{profile.organization}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveProfile}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Critical Alerts</Label>
                <p className="text-xs text-gray-500">Water level critical alerts</p>
              </div>
              <Switch
                checked={notifications.criticalAlerts}
                onCheckedChange={(checked) => updateNotificationSetting('criticalAlerts', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Warning Alerts</Label>
                <p className="text-xs text-gray-500">Water level warning notifications</p>
              </div>
              <Switch
                checked={notifications.warningAlerts}
                onCheckedChange={(checked) => updateNotificationSetting('warningAlerts', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">System Updates</Label>
                <p className="text-xs text-gray-500">App updates and maintenance</p>
              </div>
              <Switch
                checked={notifications.systemUpdates}
                onCheckedChange={(checked) => updateNotificationSetting('systemUpdates', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Weekly Reports</Label>
                <p className="text-xs text-gray-500">Automated weekly summaries</p>
              </div>
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => updateNotificationSetting('weeklyReports', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance & Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <div>
                  <Label className="text-sm">Dark Mode</Label>
                  <p className="text-xs text-gray-500">Switch to dark theme</p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <div>
                  <Label className="text-sm">High Contrast</Label>
                  <p className="text-xs text-gray-500">Improve visibility</p>
                </div>
              </div>
              <Switch
                checked={highContrast}
                onCheckedChange={toggleHighContrast}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <div>
                  <Label className="text-sm">Large Fonts</Label>
                  <p className="text-xs text-gray-500">Increase text size</p>
                </div>
              </div>
              <Switch
                checked={largeFonts}
                onCheckedChange={toggleLargeFonts}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">App Version</span>
              <span>2.1.0</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Sync</span>
              <span>2 minutes ago</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Data Source</span>
              <span>CGWB API v3.2</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Location Services</span>
              <span className="text-green-600">Enabled</span>
            </div>

            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full text-sm">
                Privacy Policy
              </Button>
              <Button variant="outline" className="w-full text-sm">
                Terms of Service
              </Button>
              <Button variant="outline" className="w-full text-sm text-red-600 hover:bg-red-50">
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}