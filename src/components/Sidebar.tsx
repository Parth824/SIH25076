import React from 'react';
import { MessageCircle, Plus, Bookmark, FolderSync as Sync, FileText, Radio, Wheat, TrendingUp, MapPin, Thermometer, Eye, Music, Users, Palette, Recycle, Building, Menu, X } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'new-chat', label: 'New chat', icon: Plus, action: () => setCurrentView('chat') },
    { id: 'saved-chats', label: 'Saved chats', icon: Bookmark },
    { id: 'sync', label: 'Sync', icon: Sync },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'canal', label: 'Canal', icon: Radio },
  ];

  const serviceItems = [
    { id: 'type-assistance', label: 'Type Assistance Request', icon: MessageCircle },
    { id: 'quickstart-function', label: 'Quickstart Function Plot', icon: TrendingUp },
    { id: 'toyota-names', label: 'Toyota Names Poetry', icon: FileText },
    { id: 'urban-green', label: 'Urban Green Spaces', icon: MapPin },
    { id: 'historical-landmarks', label: 'Historical Landmarks Guide', icon: Building },
    { id: 'seasonal-food', label: 'Seasonal Food Truck Trends', icon: Wheat },
    { id: 'digital-art', label: 'Digital Art Techniques', icon: Palette },
    { id: 'virtual-reality', label: 'Virtual Reality Experiences', icon: Eye },
    { id: 'local-music', label: 'Local Music Scene Highlights', icon: Music },
    { id: 'culinary-heritage', label: 'Culinary Heritage Preservation', icon: Recycle },
    { id: 'sustainable-fashion', label: 'Sustainable Fashion Innovations', icon: Recycle },
    { id: 'community-gardening', label: 'Community Gardening Initiatives', icon: Users },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md lg:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">MyKisan</h2>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Radio size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2 mb-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) item.action();
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <item.icon size={16} className="mr-3" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="space-y-1">
              {serviceItems.map((item) => (
                <button
                  key={item.id}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <item.icon size={14} className="mr-3" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;