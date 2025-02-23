import { getCollection } from 'astro:content';
import { filterPosts } from './filterPosts';
import { sortByDate } from './sortByDate';

async function getSortedBlog() {
  const blog = await getCollection('blog', filterPosts);

  return sortByDate(blog);
}

async function getSortedProjects() {
  const projects = await getCollection('projects', filterPosts);

  return sortByDate(projects);
}

async function getSortedPosts() {
  const [blogPosts, projectPosts] = await Promise.all([
    getSortedBlog(),
    getSortedProjects(),
  ]);
  return sortByDate([...blogPosts, ...projectPosts]);
}

export const blog = await getSortedBlog();
export const projects = await getSortedProjects();
export const posts = await getSortedPosts();
