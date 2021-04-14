FROM r-base
RUN apt-get update && apt-get install -y  git-core libcurl4-openssl-dev libgit2-dev libicu-dev libmariadb-dev libssl-dev libxml2-dev make pandoc pandoc-citeproc && rm -rf /var/lib/apt/lists/*
#RUN echo "options(repos = c(CRAN = 'https://cran.rstudio.com/'), download.file.method = 'libcurl')" >> /usr/local/lib/R/etc/Rprofile.site
RUN R -e 'install.packages("remotes")'
#RUN R -e 'remotes::install_github("r-lib/remotes", ref = "97bbf81")'
RUN Rscript -e 'remotes::install_version("magrittr",upgrade="never", version = "2.0.1")'
RUN Rscript -e 'remotes::install_version("processx",upgrade="never", version = "3.4.5")'
RUN Rscript -e 'remotes::install_version("purrr",upgrade="never", version = "0.3.4")'
RUN Rscript -e 'remotes::install_version("jsonlite",upgrade="never", version = "1.7.2")'
RUN Rscript -e 'remotes::install_version("promises",upgrade="never", version = "1.1.1")'
RUN Rscript -e 'remotes::install_version("pkgload",upgrade="never", version = "1.1.0")'
RUN Rscript -e 'remotes::install_version("dplyr",upgrade="never", version = "1.0.4")'
RUN Rscript -e 'remotes::install_version("DBI",upgrade="never", version = "1.1.1")'
RUN Rscript -e 'remotes::install_version("testthat",upgrade="never", version = "3.0.1")'
RUN Rscript -e 'remotes::install_version("shiny",upgrade="never", version = "1.6.0")'
RUN Rscript -e 'remotes::install_version("config",upgrade="never", version = "0.3.1")'
RUN Rscript -e 'remotes::install_version("future",upgrade="never", version = "1.21.0")'
RUN Rscript -e 'remotes::install_version("dbplyr",upgrade="never", version = "2.1.0")'
RUN Rscript -e 'remotes::install_version("logger",upgrade="never", version = "0.1")'
RUN Rscript -e 'remotes::install_version("RMariaDB",upgrade="never", version = "1.1.0")'
RUN Rscript -e 'remotes::install_version("pool",upgrade="never", version = "0.1.6")'
RUN Rscript -e 'remotes::install_version("golem",upgrade="never", version = "0.2.1")'
RUN mkdir /build_zone
ADD . /build_zone
WORKDIR /build_zone
RUN R -e 'remotes::install_local(upgrade="never")'
EXPOSE 3838
CMD  ["R", "-e", "options('shiny.port'=3838,shiny.host='0.0.0.0');kramShinyReact::run_app()"]
