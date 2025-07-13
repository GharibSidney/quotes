import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QuoteService from '../services/QuoteService';
import { QuoteCategory, QuoteBackgroundColor, CreateQuoteData } from '../types/Quote';

interface CreateQuoteModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface CategoryOption {
  value: QuoteCategory;
  label: string;
}

interface ColorOption {
  value: QuoteBackgroundColor;
  label: string;
  colors: string[];
}

const categories: CategoryOption[] = [
  { value: 'inspiration', label: 'Inspiration' },
  { value: 'motivation', label: 'Motivation' },
  { value: 'love', label: 'Love' },
  { value: 'wisdom', label: 'Wisdom' },
  { value: 'success', label: 'Success' },
  { value: 'life', label: 'Life' },
  { value: 'happiness', label: 'Happiness' },
  { value: 'friendship', label: 'Friendship' }
];

const colorOptions: ColorOption[] = [
  { value: 'blue', label: 'Ocean Blue', colors: ['#60A5FA', '#3B82F6'] },
  { value: 'purple', label: 'Royal Purple', colors: ['#A78BFA', '#8B5CF6'] },
  { value: 'green', label: 'Nature Green', colors: ['#34D399', '#10B981'] },
  { value: 'orange', label: 'Sunset Orange', colors: ['#FB923C', '#F97316'] },
  { value: 'pink', label: 'Rose Pink', colors: ['#F472B6', '#EC4899'] },
  { value: 'teal', label: 'Ocean Teal', colors: ['#5EEAD4', '#14B8A6'] }
];

export default function CreateQuoteModal({ isVisible, onClose, onSave }: CreateQuoteModalProps): JSX.Element {
  const [formData, setFormData] = useState<CreateQuoteData>({
    text: '',
    author: '',
    category: 'inspiration',
    background_color: 'blue',
    is_favorite: false
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    if (!formData.text.trim() || !formData.author.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await QuoteService.create(formData);
      setFormData({
        text: '',
        author: '',
        category: 'inspiration',
        background_color: 'blue',
        is_favorite: false
      });
      onSave();
      onClose();
    } catch (error) {
      console.error('Error creating quote:', error);
      Alert.alert('Error', 'Failed to create quote');
    }
    setIsSubmitting(false);
  };

  const selectedColor = colorOptions.find(c => c.value === formData.background_color) || colorOptions[0];

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Quote</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quote Text</Text>
            <TextInput
              style={styles.textArea}
              value={formData.text}
              onChangeText={(text) => setFormData({ ...formData, text })}
              placeholder="Enter your inspiring quote..."
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Author</Text>
            <TextInput
              style={styles.input}
              value={formData.author}
              onChangeText={(author) => setFormData({ ...formData, author })}
              placeholder="Who said this?"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preview</Text>
            <View style={[styles.preview, { backgroundColor: selectedColor.colors[0] }]}>
              <Text style={styles.previewText}>
                "{formData.text || 'Your quote here...'}"
              </Text>
              <Text style={styles.previewAuthor}>
                — {formData.author || 'Author'}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.createButton, (!formData.text.trim() || !formData.author.trim()) && styles.createButtonDisabled]}
            onPress={handleSubmit}
            disabled={!formData.text.trim() || !formData.author.trim() || isSubmitting}
          >
            <Text style={styles.createButtonText}>
              {isSubmitting ? 'Creating...' : 'Create Quote'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white' },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#1F2937' },
  content: { flex: 1, padding: 20 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: 'white', borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  textArea: { backgroundColor: 'white', borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB', minHeight: 100, textAlignVertical: 'top' },
  preview: { borderRadius: 16, padding: 16, alignItems: 'center', minHeight: 80 },
  previewText: { fontSize: 14, fontWeight: '500', color: 'white', textAlign: 'center', marginBottom: 4 },
  previewAuthor: { fontSize: 12, color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' },
  actions: { flexDirection: 'row', padding: 20, gap: 12 },
  cancelButton: { flex: 1, paddingVertical: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: 'white', alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '500', color: '#6B7280' },
  createButton: { flex: 1, paddingVertical: 16, borderRadius: 12, backgroundColor: '#007AFF', alignItems: 'center' },
  createButtonDisabled: { backgroundColor: '#D1D5DB' },
  createButtonText: { fontSize: 16, fontWeight: '500', color: 'white' },
});
