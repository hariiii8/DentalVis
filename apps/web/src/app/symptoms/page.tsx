import React from 'react';
import Link from 'next/link';
import { Container, Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@dentalvis/ui';
import { AlertCircle, ArrowRight, Compass, ShieldAlert } from 'lucide-react';

export default function SymptomsPage() {
  const commonSymptoms = [
    {
      title: 'Sudden Sharp Pain While Chewing',
      titleTa: 'மெல்லும்போது ஏற்படும் தீவிர பல் வலி',
      categorySlug: 'pain-and-sensitivity',
      categoryName: 'Pain & Sensitivity',
      description: 'May indicate a cracked tooth, deep decay reaching the pulp, or a loose filling.',
    },
    {
      title: 'Persistent Sensitivity to Cold or Heat',
      titleTa: 'சூடு அல்லது குளிருக்கு நீடிக்கும் கூச்சம்',
      categorySlug: 'pain-and-sensitivity',
      categoryName: 'Pain & Sensitivity',
      description: 'Often points to exposed dentin, enamel wear, or inflammation within the nerve canals.',
    },
    {
      title: 'Bleeding While Brushing or Flossing',
      titleTa: 'பல் துலக்கும்போது ஈறுகளில் இரத்தம்',
      categorySlug: 'gums-and-bleeding',
      categoryName: 'Gums & Bleeding',
      description: 'An early sign of gingivitis or tartar accumulation beneath the gumline requiring gentle scaling.',
    },
    {
      title: 'Visible Chip or Rough Edge on Enamel',
      titleTa: 'பல்லில் தெரியும் விரிசல் அல்லது உடைந்த பகுதி',
      categorySlug: 'broken-or-chipped-teeth',
      categoryName: 'Broken or Chipped Teeth',
      description: 'Can be smoothed, bonded with composite resin, or protected with a custom dental crown.',
    },
    {
      title: 'Gaps from a Lost or Extracted Tooth',
      titleTa: 'இழந்த பல்லினால் ஏற்பட்ட இடைவெளி',
      categorySlug: 'missing-teeth',
      categoryName: 'Missing Teeth',
      description: 'Understanding implants, bridges, and how tooth replacement preserves jawbone alignment.',
    },
  ];

  return (
    <div className="py-12 space-y-12">
      <Container>
        {/* Header */}
        <div className="max-w-2xl space-y-4 mb-12">
          <Badge variant="default" className="gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Educational Navigation</span>
          </Badge>
          <h1 className="text-4xl font-extrabold text-[#134E4A] tracking-tight">
            Educational Symptom Directory
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Find visual explanations based on common oral sensations. This directory helps you understand potential causes and treatment approaches to discuss with your dentist.
          </p>
        </div>

        {/* Symptoms List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {commonSymptoms.map((symptom, idx) => (
            <Card key={idx} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="mint" className="text-xs">
                    {symptom.categoryName}
                  </Badge>
                  <AlertCircle className="w-4 h-4 text-[#0D9488]" />
                </div>
                <CardTitle className="text-lg">{symptom.title}</CardTitle>
                <p className="text-xs font-semibold text-[#0D9488]">{symptom.titleTa}</p>
                <CardDescription>{symptom.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={`/explore/${symptom.categorySlug}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold justify-between border-teal-200">
                    <span>Learn About Relevant Treatments</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Important Ethical Disclaimer Banner */}
        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-2 text-sm leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <span>Educational Notice — Not a Diagnostic Tool</span>
          </div>
          <p>
            Symptoms described here are for patient education only. Oral conditions cannot be self-diagnosed. Please schedule an examination with a qualified dental clinician for accurate diagnosis and personalized treatment.
          </p>
        </div>
      </Container>
    </div>
  );
}
