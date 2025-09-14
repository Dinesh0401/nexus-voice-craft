import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type Post = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category?: string;
  aiGenerated?: boolean;
};

const posts: Post[] = [
  {
    id: 1,
    title: "From Campus to Career: A Success Story",
    excerpt: "Learn how our alumni are making waves in their industries...",
    image: "",
    date: "January 15, 2025",
    category: "Career Success",
    aiGenerated: true
  },
  {
    id: 2,
    title: "Networking in the Digital Age",
    excerpt: "Tips and strategies for building meaningful professional connections...",
    image: "",
    date: "December 2, 2024", 
    category: "Professional Development",
    aiGenerated: true
  }
];

const EnhancedRecentPosts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [postsWithImages, setPostsWithImages] = useState<Post[]>(posts);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    generateImagesForPosts();
  }, []);

  const generateImagesForPosts = async () => {
    try {
      const updatedPosts = await Promise.all(
        posts.map(async (post) => {
          if (post.aiGenerated) {
            const imagePrompt = getImagePrompt(post);
            const generatedImage = await generateBlogImage(imagePrompt, post.title, post.category || 'General');
            return {
              ...post,
              image: generatedImage || "/lovable-uploads/87030a39-6fa7-425b-99f4-05b0abb9ded1.png"
            };
          }
          return post;
        })
      );
      
      setPostsWithImages(updatedPosts);
      setLoadingImages(false);
    } catch (error) {
      console.error('Error generating images:', error);
      // Fallback to existing images
      setPostsWithImages(posts.map(post => ({
        ...post,
        image: post.id === 1 ? "/lovable-uploads/87030a39-6fa7-425b-99f4-05b0abb9ded1.png" : "/lovable-uploads/55f04ec5-8a46-435f-bfc6-06b4f7389672.png"
      })));
      setLoadingImages(false);
      
      toast({
        title: "Note",
        description: "AI image generation requires Hugging Face API key setup. Using placeholder images."
      });
    }
  };

  const getImagePrompt = (post: Post): string => {
    const prompts: Record<number, string> = {
      1: "Young professional graduate in business attire walking confidently from university campus towards modern office buildings, representing career transition and success",
      2: "Modern digital networking concept with connected people icons, laptops, smartphones, and virtual meeting interfaces in a professional tech environment"
    };
    
    return prompts[post.id] || "Professional blog post header image with modern corporate aesthetic";
  };

  const generateBlogImage = async (prompt: string, title: string, category: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-images', {
        body: { prompt, title, category }
      });

      if (error) throw error;
      return data.image;
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  };

  const handleReadMore = (postId: number) => {
    navigate(`/blog/${postId}`);
  };

  const handleViewAllArticles = () => {
    navigate('/blog');
  };

  const handleRegenerateImages = () => {
    setLoadingImages(true);
    generateImagesForPosts();
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-background to-ai-surface/10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-ai-primary/10 text-ai-primary border-ai-border">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Enhanced Content
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            <span className="bg-gradient-to-r from-ai-primary via-ai-secondary to-ai-accent bg-clip-text text-transparent">
              Latest Stories
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Insights, success stories, and advice from our community, enhanced with AI-generated visuals.
          </p>
        </motion.div>

        {/* Regenerate Button */}
        <div className="flex justify-center mb-8">
          <Button 
            onClick={handleRegenerateImages}
            variant="outline"
            className="border-ai-border hover:bg-ai-surface"
            disabled={loadingImages}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            {loadingImages ? 'Generating Images...' : 'Regenerate AI Images'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {postsWithImages.map((post, index) => (
            <motion.div 
              key={post.id} 
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-background to-ai-surface shadow-ai-soft border border-ai-border hover:shadow-ai-glow transition-all duration-500 group-hover:scale-[1.02]">
                {/* AI Badge */}
                {post.aiGenerated && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-ai-primary text-white shadow-ai-glow">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Generated
                    </Badge>
                  </div>
                )}

                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  {loadingImages ? (
                    <div className="w-full h-full bg-gradient-to-r from-ai-surface via-ai-accent/20 to-ai-surface animate-shimmer bg-[length:200%_100%] flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <Sparkles className="w-8 h-8 text-ai-primary animate-pulse" />
                        <span className="text-sm text-muted-foreground">Generating AI image...</span>
                      </div>
                    </div>
                  ) : (
                    <motion.img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-8">
                  {post.category && (
                    <Badge variant="secondary" className="mb-3 bg-ai-accent/20 text-ai-primary border-ai-border">
                      {post.category}
                    </Badge>
                  )}
                  
                  <h3 className="font-bold text-2xl mb-3 group-hover:text-ai-primary transition-colors duration-300">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {post.date}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      className="text-ai-primary hover:text-ai-secondary hover:bg-ai-surface group-hover:translate-x-1 transition-all duration-300" 
                      onClick={() => handleReadMore(post.id)}
                    >
                      Read more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Button 
            onClick={handleViewAllArticles} 
            className="bg-gradient-to-r from-ai-primary to-ai-secondary hover:from-ai-primary/90 hover:to-ai-secondary/90 text-white px-8 py-3 shadow-ai-glow"
          >
            View all articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedRecentPosts;