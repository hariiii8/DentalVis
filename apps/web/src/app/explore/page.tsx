import React from 'react';
import Link from 'next/link';
import { Container, Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@dentalvis/ui';
import { CANONICAL_EXPLORE_CATEGORIES, CANONICAL_PROCEDURES } from '@dentalvis/common';
import { Compass, ArrowRight, Box, Clock } from 'lucide-react';

export default function ExplorePage() {
  return (
    <div className="py-12 space-y-16">
      <Container>
        {/* Page Header */}
        <div className="max-w-2xl space-y-4 mb-12">
          <Badge variant="default" className="gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Patient-Facing Exploration</span>
          </Badge>
          <h1 className="text-4xl font-extrabold text-[#134E4A] tracking-tight">
            Explore Dental Treatments
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Select a topic below to discover how specific dental concerns are addressed through modern, comfortable treatment procedures.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {CANONICAL_EXPLORE_CATEGORIES.map((category) => (
            <Link key={category.id} href={`/explore/${category.slug}`} className="group block">
              <Card className="h-full hover:translate-y-[-2px] transition-all">
                <CardHeader>
                  <div className="w-10 h-10 rounded-xl bg-[#E6F7F2] text-[#0D9488] flex items-center justify-center mb-3 group-hover:bg-[#0D9488] group-hover:text-white transition-colors">
                    <Compass className="w-5 h-5" />
                  </div>
                  <CardTitle className="group-hover:text-[#0D9488] transition-colors">{category.titleEn}</CardTitle>
                  <p className="text-xs font-semibold text-[#0D9488]">{category.titleTa}</p>
                  <CardDescription>{category.descriptionEn}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs font-semibold text-[#0D9488] flex items-center gap-1 group-hover:underline">
                    <span>View category procedures</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* All Available Procedures Directory */}
        <div className="pt-8 border-t border-teal-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#134E4A]">Complete Treatment Directory</h2>
            <p className="text-sm text-slate-600 mt-1">Browse all validated educational visual guides across all dental areas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CANONICAL_PROCEDURES.map((proc) => (
              <Card key={proc.id} className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-500">
                      {proc.primaryDepartmentName}
                    </Badge>
                    {proc.has3DModel && (
                      <Badge variant="default" className="text-[10px] gap-1">
                        <Box className="w-3 h-3" />
                        <span>3D View</span>
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{proc.titleEn}</CardTitle>
                  <p className="text-xs font-medium text-teal-700/80">{proc.titleTa}</p>
                  <CardDescription className="line-clamp-2">{proc.summaryEn}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 pt-4 border-t border-slate-100">
                    <Clock className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span>~{proc.durationMinutes} minutes duration</span>
                  </div>

                  <Link href={`/procedures/${proc.slug}`} className="block w-full">
                    <Button variant="mint" size="sm" className="w-full text-xs font-semibold justify-between">
                      <span>View Procedure Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
