import React from 'react';
import Link from 'next/link';
import { Container, Button, Card, Badge } from '@dentalvis/ui';
import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';

export default function EmergencyPage() {
  const emergencies = [
    {
      title: 'Knocked-Out Tooth (Avulsion)',
      titleTa: 'முழுமையாக வெளியே விழுந்த பல்',
      action: 'Handle by the crown only, never touch the root. Rinse gently with cold milk or saline if dirty, and place back in the socket or store in milk. Seek an emergency dentist within 60 minutes.',
      urgency: 'Immediate (within 1 hour)',
    },
    {
      title: 'Severe Uncontrollable Toothache or Facial Swelling',
      titleTa: 'கடுமையான பல் வலி அல்லது முக வீக்கம்',
      action: 'Rinse with warm saltwater. Apply a cold compress to the outside of the cheek. Do not place aspirin directly on the gums. Seek same-day clinical attention to rule out spreading infection.',
      urgency: 'Same-day clinical care',
    },
    {
      title: 'Broken or Fractured Tooth with Pain',
      titleTa: 'கடுமையான வலியுடன் உடைந்த பல்',
      action: 'Rinse mouth with warm water. Save any broken pieces in clean water or milk. Apply gauze if bleeding is present and visit a dentist promptly.',
      urgency: 'Prompt attention',
    },
  ];

  return (
    <div className="py-12 space-y-12">
      <Container>
        {/* Warning Banner */}
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-rose-900">Immediate Healthcare Notice</h2>
              <p className="text-sm text-rose-700">
                If you have difficulty breathing, swallowing, or severe facial trauma, visit the nearest emergency hospital immediately.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Time-Critical First Aid</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="max-w-2xl space-y-3">
          <h1 className="text-4xl font-extrabold text-[#134E4A] tracking-tight">
            Emergency Dental Guidance
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            First-aid instructions while you arrange urgent transport to a certified dental clinician or emergency room.
          </p>
        </div>

        {/* Emergency Situations */}
        <div className="space-y-6 max-w-4xl">
          {emergencies.map((item, idx) => (
            <Card key={idx} className="p-6 border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl font-bold text-[#134E4A]">{item.title}</h3>
                  <p className="text-xs font-semibold text-[#0D9488]">{item.titleTa}</p>
                </div>
                <Badge variant="alert" className="self-start sm:self-auto">
                  {item.urgency}
                </Badge>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm leading-relaxed mt-2">
                <span className="font-bold text-slate-900 block mb-1">Recommended Immediate Action:</span>
                {item.action}
              </div>
            </Card>
          ))}
        </div>

        {/* Return to Educational Content */}
        <div className="pt-6">
          <Link href="/explore">
            <Button variant="outline" className="gap-2 text-[#0D9488] border-teal-200 hover:bg-teal-50">
              <span>Return to Treatment Guides</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
