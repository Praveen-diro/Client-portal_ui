'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Plus } from 'lucide-react';
import { worldMapService, CountryData, SourceData } from '../../services/worldmap.service';
// import { stage2 as env } from '../../config/environment';
import { SourceModal } from '../../components/source-modal';
import { Label } from '@/components/ui/label';

interface Portal extends SourceData {
  id: string;
}

interface MapData {
  type: string;
  data?: any;
}

export default function SeeCoverage() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Crypto');
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [portals, setPortals] = useState<Portal[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [countrySearchValue, setCountrySearchValue] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<Portal | null>(null);

  // Get ISO code from localStorage
  const isoCode = typeof window !== 'undefined' ? localStorage.getItem("iso_code") : null;

  // Filter countries based on search
  const filteredCountries = countries.filter(country => 
    country.country.toLowerCase().includes(countrySearchValue.toLowerCase())
  );

  const handleCountrySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountrySearchValue(e.target.value);
  };

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await worldMapService.getVerifiedCountries();
        console.log('Countries Response:', response); // Debug log

        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          setCountries(response.data);
          
          // Set default country based on ISO code
          if (isoCode) {
            const defaultCountry = response.data.find(country => country.alpha2code === isoCode);
            if (defaultCountry?.uniquekey && !selectedCountry) {
              setSelectedCountry(defaultCountry.uniquekey);
            } else {
              // If no matching country found for ISO code, use first country
              setSelectedCountry(response.data[0].uniquekey);
            }
          } else {
            // If no ISO code, use first country
            setSelectedCountry(response.data[0].uniquekey);
          }
        } else {
          console.error('Invalid countries data:', {
            success: response.success,
            dataIsArray: Array.isArray(response.data),
            dataLength: response.data?.length,
            error: response.error
          });
          setCountries([]);
        }
      } catch (error) {
        console.error('Error loading countries:', error);
        setCountries([]);
      }
    };
    loadCountries();
  }, [isoCode]);

  useEffect(() => {
    const loadPortals = async () => {
      if (!selectedCountry) return;
      
      setLoading(true);
      const category = getCategoryKey(selectedCategory);
      const response = await worldMapService.getCountryLinks(category, selectedCountry, searchValue);
      if (response.success && response.data) {
        setPortals(response.data);
      }
      setLoading(false);
    };
    loadPortals();
  }, [selectedCountry, selectedCategory, searchValue]);

  const getCategoryKey = (category: string): string => {
    switch (category) {
      case 'Identity':
        return 'id';
      case 'Bank':
        return 'bank';
      case 'Crypto':
        return 'crypto';
      case 'Organization':
        return 'organization';
      case 'Utilities':
        return 'address';
      case 'Professional':
        return 'professional';
      default:
        return '';
    }
  };

  const handleAddPortal = () => {
    setEditingSource(null);
    setModalOpen(true);
  };

  const handleEditPortal = (portal: Portal) => {
    setEditingSource(portal);
    setModalOpen(true);
  };

  const handleDeletePortal = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this source?')) {
      const response = await worldMapService.deleteSource(id);
      if (response.success) {
        setPortals(portals.filter(portal => portal.id !== id));
      }
    }
  };

  const handleSourceSubmit = async (data: SourceData) => {
    try {
      if (editingSource) {
        const response = await worldMapService.updateSource({
          ...data,
          id: editingSource.id,
        });
        if (response.success) {
          setPortals(portals.map(p => p.id === editingSource.id ? { ...response.data, id: editingSource.id } : p));
        }
      } else {
        const response = await worldMapService.createSource(data);
        if (response.success) {
          setPortals([...portals, response.data]);
        }
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving source:', error);
    }
  };

  const getSelectedCountryName = () => {
    if (!Array.isArray(countries)) return '';
    const country = countries.find(c => c?.uniquekey === selectedCountry);
    return country?.country || '';
  };

  const categories = [
    'Identity',
    'Professional',
    'Bank',
    'Utilities',
    'Organization',
    'Crypto'
  ];

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
  };

  const handleMapClick = () => {
    if (selectedCountry) {
      setSelectedCountry('');
      setPortals([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ?? '';
    setSearchValue(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Country Selection and Map */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Support Portals</h2>
              {selectedCountry && (
                <p className="text-gray-500 mt-1">
                  {getSelectedCountryName()}
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-12 gap-6">
            {/* World Map */}
            <div className="col-span-9">
              <div 
                className="w-full h-[400px] bg-white rounded-lg cursor-pointer" 
                onClick={handleMapClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleMapClick();
                  }
                }}
                tabIndex={0}
              >
                {/* <iframe 
                  src={`${env.worldmap}?country=${selectedCountry}`}
                  className="w-full h-full border-0 rounded-lg"
                  title="World Map Coverage"
                /> */}
              </div>
            </div>

            {/* Country Selection */}
            <div className="col-span-3 border-l border-gray-200 pl-6">
              <div className="space-y-2">
                <Label htmlFor="country-select">Select Country</Label>
                <Select 
                  value={selectedCountry} 
                  onValueChange={handleCountryChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-2">
                      <Input
                        placeholder="Search country..."
                        value={countrySearchValue}
                        onChange={handleCountrySearch}
                        className="mb-2"
                      />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {Array.isArray(filteredCountries) && filteredCountries.map(country => (
                        <SelectItem key={country.uniquekey} value={country.uniquekey}>
                          {country.country}
                        </SelectItem>
                      ))}
                      {filteredCountries.length === 0 && (
                        <div className="text-center py-2 text-gray-500">
                          No countries found
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Rest of the existing UI */}
        {selectedCountry && (
          <div className="grid grid-cols-12 gap-6">
            {/* Categories */}
            <div className="col-span-3">
              <Card className="p-4">
                <div className="space-y-2">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Portals List */}
            <div className="col-span-9">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-semibold">{selectedCategory}</h3>
                    <div className="text-sm text-gray-500">({portals.length} sources)</div>
                  </div>
                  <div className="flex gap-4">
                    <Input
                      type="text"
                      placeholder={`${selectedCategory} search`}
                      value={searchValue || ''}
                      onChange={handleSearchChange}
                      className="w-[200px]"
                    />
                    <Button onClick={handleAddPortal} className="flex items-center gap-2">
                      <Plus size={16} /> Add new source
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : (
                    portals.map(portal => (
                      <div 
                        key={portal.id} 
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-gray-200 transition-colors"
                      >
                        <div>
                          <h4 className="font-medium">{portal.nickname}</h4>
                          <p className="text-sm text-gray-500">
                            {typeof portal.link === 'string' 
                              ? portal.link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "") 
                              : (portal.link as any)?.toString?.() || 'Invalid URL'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditPortal(portal)}
                            className="hover:bg-gray-100"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeletePortal(portal.id)}
                            className="hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      <SourceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSourceSubmit}
        initialData={editingSource || undefined}
        countryId={selectedCountry}
        countryName={getSelectedCountryName()}
      />
    </div>
  );
}
