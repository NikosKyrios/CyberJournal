module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets");

    eleventyConfig.addFilter("filterByPath", function(articles, path) {
    return articles.filter(article => {
      return article.filePathStem.includes(path);
      });
    });

    eleventyConfig.addCollection("articles", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/**/*.md").filter(item => {
            const path = item.filePathStem;
            return !path.endsWith("/index") && path !== "/index" && path !== "/about" && path !== "/glossary";
        });
    });

    return {
        dir: {
            input: "src",
            output: "_site"
        },
        pathPrefix: "/"
    };
};