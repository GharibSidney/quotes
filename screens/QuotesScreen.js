import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuoteGrid from '../components/QuoteGrid';
import CreateQuoteModal from '../components/CreateQuoteModal';
import { QuoteService } from '../services/QuoteService';

const { width } = Dimensions.get('window');

export default function QuotesScreen() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    setIsLoading(true);
    try {
      const data = await QuoteService.list();
      setQuotes(data);
    } catch (error) {
      console.error('Error loading quotes:', error);
      Alert.alert('Error', 'Failed to load quotes');
    }
    setIsLoading(false);
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quote.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || quote.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'inspiration', label: 'Inspiration' },
    { value: 'motivation', label: 'Motivation' },
    { value: 'love', label: 'Love' },
    { value: 'wisdom', label: 'Wisdom' },
    { value: 'success', label: 'Success' },
    { value: 'life', label: 'Life' },
    { value: 'happiness', label: 'Happiness' },
    { value: 'friendship', label: 'Friendship' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Your Quote
            <Text style={styles.titleGradient}> Collection</Text>
          </Text>
          <Text style={styles.subtitle}>
            Curate and display your favorite quotes in beautiful, shareable widgets
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search quotes or authors..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.value}
              style={[
                styles.categoryButton,
                categoryFilter === category.value && styles.categoryButtonActive
              ]}
              onPress={() => setCategoryFilter(category.value)}
            >
              <Text style={[
                styles.categoryText,
                categoryFilter === category.value && styles.categoryTextActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{quotes.length}</Text>
            <Text style={styles.statLabel}>Total Quotes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#EF4444' }]}>
              {quotes.filter(q => q.is_favorite).length}
            </Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#3B82F6' }]}>
              {new Set(quotes.map(q => q.author)).size}
            </Text>
            <Text style={styles.statLabel}>Authors</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#8B5CF6' }]}>
              {new Set(quotes.map(q => q.category)).size}
            </Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>

        {/* Quotes Grid */}
        <QuoteGrid 
          quotes={filteredQuotes} 
          onUpdate={loadQuotes} 
          isLoading={isLoading}
        />

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsModalOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </ScrollView>

      {/* Create Quote Modal */}
      <CreateQuoteModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={loadQuotes}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  titleGradient: {
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
}); 