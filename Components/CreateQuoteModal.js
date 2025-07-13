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
import { QuoteService } from '../services/QuoteService';

const { width } = Dimensions.get('window');

const categories = [
  { value: 'inspiration', label: 'Inspiration' },
  { value: 'motivation', label: 'Motivation' },
  { value: 'love', label: 'Love' },
  { value: 'wisdom', label: 'Wisdom' },
  { value: 'success', label: 'Success' },
  { value: 'life', label: 'Life' },
  { value: 'happiness', label: 'Happiness' },
  { value: 'friendship', label: 'Friendship' }
];

const colorOptions = [
  { value: 'blue', label: 'Ocean Blue', colors: ['#60A5FA', '#3B82F6'] },
  { value: 'purple', label: 'Royal Purple', colors: ['#A78BFA', '#8B5CF6'] },
  { value: 'green', label: 'Nature Green', colors: ['#34D399', '#10B981'] },
  { value: 'orange', label: 'Sunset Orange', colors: ['#FB923C', '#F97316'] },
  { value: 'pink', label: 'Rose Pink', colors: ['#F472B6', '#EC4899'] },
  { value: 'teal', label: 'Ocean Teal', colors: ['#5EEAD4', '#14B8A6'] }
];

export default function CreateQuoteModal({ isVisible, onClose, onSave }) {
  const [formData, setFormData] = useState({
    text: '',
    author: '',
    category: 'inspiration',
    background_color: 'blue',
    is_favorite: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
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

  const selectedColor = colorOptions.find(c => c.value === formData.background_color);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons name="sparkles" size={16} color="white" />
            </View>
            <Text style={styles.headerTitle}>Create Quote</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Quote Text */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quote Text</Text>
            <TextInput
              style={styles.textArea}
              value={formData.text}
              onChangeText={(text) => setFormData({ ...formData, text })}
              placeholder="Enter your inspiring quote..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Author */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Author</Text>
            <TextInput
              style={styles.input}
              value={formData.author}
              onChangeText={(author) => setFormData({ ...formData, author })}
              placeholder="Who said this?"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Category and Color */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.optionsContainer}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.value}
                      style={[
                        styles.optionButton,
                        formData.category === category.value && styles.optionButtonActive
                      ]}
                      onPress={() => setFormData({ ...formData, category: category.value })}
                    >
                      <Text style={[
                        styles.optionText,
                        formData.category === category.value && styles.optionTextActive
                      ]}>
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Color Theme</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsContainer}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color.value}
                    style={[
                      styles.colorOption,
                      formData.background_color === color.value && styles.colorOptionActive
                    ]}
                    onPress={() => setFormData({ ...formData, background_color: color.value })}
                  >
                    <View style={[styles.colorPreview, { backgroundColor: color.colors[0] }]} />
                    <Text style={[
                      styles.colorLabel,
                      formData.background_color === color.value && styles.colorLabelActive
                    ]}>
                      {color.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Preview */}
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

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.createButton,
              (!formData.text.trim() || !formData.author.trim() || isSubmitting) && styles.createButtonDisabled
            ]}
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
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 100,
  },
  row: {
    flexDirection: 'row',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  optionTextActive: {
    color: 'white',
  },
  colorOption: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  colorOptionActive: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F9FF',
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 4,
  },
  colorLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  colorLabelActive: {
    color: '#007AFF',
  },
  preview: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  previewAuthor: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  createButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
}); 