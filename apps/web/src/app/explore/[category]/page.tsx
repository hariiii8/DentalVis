import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@dentalvis/ui';
import { CANONICAL_EXPLORE_CATEGORIES, CANONICAL_PROCEDURES } from '@dentalvis/common';
import { ArrowLeft, ArrowRight, Box, Clock, Compass } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  
  const category = CANONICAL_EXPLORE_CATEGORIES.find(c => c.slug === categorySlug);
  if (!category) {
    notFound();
  }

  const relatedProcedures = CANONICAL_PROCEDURES.filter(p => 
    p.exploreCategorySlugs.includes(category.slug)
  );

  return (
    <div className="py-12 space-y-12">
      <Container>
        {/* Back Link */}
        <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-[#0D9488] font-semibold hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Categories</span>
        </Link>

        {/* Category Header */}
        <div className="max-w-3xl space-y-4 mb-12">
          <Badge variant="default" className="gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Educational Category</span>
          </Badge>
          <h1 className="text-4xl font-extrabold text-[#134E4A] tracking-tight">
            {category.titleEn}
          </h1>
          <p className="text-base font-semibold text-[#0D9488]">{category.titleTa}</p>
          <p className="text-base text-slate-600 leading-relaxed">
            {category.descriptionEn}
          </p>
          <p className="text-sm text-slate-500 leading-relaxed italic">
            {category.descriptionTa}
          </p>
        </div>

        {/* Related Procedures */}
        <div>
          <h2 className="text-2xl font-bold text-[#134E4A] mb-6">Related Treatments & Visual Guides</h2>
          {relatedProcedures.length === 0 ? (
            <Card className="p-8 text-center bg-teal-50/50">
              <p className="text-slate-600">Additional educational guides for this category are currently in clinical review.</p>
              <Link href="/explore" className="inline-block mt-4">
                <Button variant="outline" size="sm">Explore other categories</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProcedures.map((proc) => (
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
                    <CardDescription className="line-clamp-3">{proc.summaryEn}</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 pt-4 border-t border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-[#0D9488]" />
                      <span>~{proc.durationMinutes} minutes duration</span>
                    </div>

                    <Link href={`/procedures/${proc.slug}`} className="block w-full">
                      <Button variant="mint" size="sm" className="w-full text-xs font-semibold justify-between">
                        <span>View Treatment Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
