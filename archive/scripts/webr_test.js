import { WebR } from 'webr';

async function main() {
  const webr = new WebR();
  await webr.init();
  console.log('WebR initialized');
  
  await webr.evalRVoid(`
    webr::install("seminr")
  `);
  console.log('seminr installed');
  
  const res = await webr.evalR(`
    library(seminr)
    mobi <- mobi
    mobi_mm <- constructs(
      composite("Image",        multi_items("IMAG", 1:5)),
      composite("Expectation",  multi_items("CUEX", 1:3)),
      composite("Loyalty",      multi_items("CUSL", 1:3))
    )
    mobi_sm <- relationships(
      paths(from = "Image",        to = c("Expectation", "Loyalty")),
      paths(from = "Expectation",  to = c("Loyalty"))
    )
    mobi_pls <- estimate_pls(data = mobi,
                            measurement_model = mobi_mm,
                            structural_model = mobi_sm)
    summ <- summary(mobi_pls)
    
    list(
      summary_names = names(summ),
      paths_class = class(summ$paths),
      paths_names = if(is.list(summ$paths)) names(summ$paths) else colnames(summ$paths)
    )
  `);
  
  const result = await res.toJs();
  console.log(JSON.stringify(result, null, 2));
  webr.destroy();
}

main().catch(console.error);
